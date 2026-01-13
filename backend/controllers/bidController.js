const Bid = require('../models/bidModel');
const Gig = require('../models/gigModel');
const User = require('../models/userModel');
const { 
  emitHiredNotification, 
  emitAssignedNotification,
  emitRejectionNotification 
} = require('../socket');
const { executeTransaction } = require('../utils/transactionHandler');

const createBid = async (req, res) => {
    try {
      const userId = req.userId;
      
      const { gigId, message, price } = req.body;

      if(!gigId || !message || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newBid = await Bid.create({ userId, gigId, message, price });
      newBid.save();

      const gig = await Gig.findByIdAndUpdate(gigId, { $push: { bids: newBid._id } }, { new: true });
      const user = await User.findByIdAndUpdate(userId, { $push: { bids: newBid._id } }, { new: true });                       

      return res.status(200).json({
        message: "Bid Created Successfully",
        bid: newBid
      });

    } catch (error) {
        return res.status(500).json({ message: "Error creating bid", error: error.message });
    }
};

const updatedBidStatus = async (req, res) => {
    try {
       const { bidId } = req.body;

       const bid = await Bid.findByIdAndUpdate(bidId, { status: 'hired'}, { new: true });
       const rejectedBids = await Bid.updateMany({ gigId: bid.gigId, _id: { $ne: bidId } }, { status: 'rejected' });

       return res.status(200).json({
        message: "Bids Updated Successfully",
        bid,
       });

    } catch (error) {
        return res.status(500).json({ message: "Error updating Bid ", error: error.message });
    }
}

/**
 * Secure hire function using MongoDB transactions with notifications for hired and rejected bidders
 */
const hireBid = async (req, res) => {
    try {
        const { bidId } = req.body;

        if (!bidId) {
            return res.status(400).json({ message: 'Bid ID is required' });
        }

        let gigOwner = null;
        let hiredFreelancer = null;
        let gigTitle = null;
        let rejectedBidUserIds = [];

        // Execute the entire hire operation as a transaction
        const result = await executeTransaction(async (session) => {
            // 1. Fetch the bid with the session to ensure read consistency
            const bid = await Bid.findById(bidId)
                .populate('gigId')
                .populate('userId')
                .session(session);

            if (!bid) {
                throw new Error('Bid not found');
            }

            if (bid.status !== 'pending') {
                throw new Error(`Bid status is ${bid.status}, only pending bids can be hired`);
            }

            // 2. Fetch the gig with the session
            const gig = await Gig.findById(bid.gigId._id)
                .populate('userId')
                .session(session);

            if (!gig) {
                throw new Error('Gig not found');
            }

            // 3. Critical check: Ensure gig is still in 'open' status
            if (gig.status !== 'open') {
                throw new Error('This gig has already been assigned to another freelancer');
            }

            if (gig.hiredFreelancerId && gig.hiredFreelancerId.toString() !== bid.userId._id.toString()) {
                throw new Error('Another freelancer has already been hired for this gig');
            }

            // Store data for notifications after transaction
            gigOwner = gig.userId;
            hiredFreelancer = bid.userId;
            gigTitle = gig.title;

            // 4. Get all rejected bids before updating them (to notify users later)
            const rejectedBids = await Bid.find({ 
                gigId: bid.gigId._id,
                _id: { $ne: bidId },
                status: 'pending'
            }).session(session);

            // Extract user IDs of rejected bidders
            rejectedBidUserIds = rejectedBids.map(b => b.userId.toString());

            // 5. Update the bid to 'hired' status with timestamp
            const hiredBid = await Bid.findByIdAndUpdate(
                bidId,
                { 
                    status: 'hired',
                    hiredAt: new Date()
                },
                { new: true, session }
            );

            // 6. Update the gig to 'assigned' status and set the hired freelancer
            const updatedGig = await Gig.findByIdAndUpdate(
                bid.gigId._id,
                { 
                    status: 'assigned',
                    hiredFreelancerId: bid.userId._id,
                    $inc: { version: 1 }
                },
                { new: true, session }
            );

            // 7. Reject all other bids for this gig
            const rejectionResult = await Bid.updateMany(
                { 
                    gigId: bid.gigId._id,
                    _id: { $ne: bidId },
                    status: 'pending'
                },
                { status: 'rejected' },
                { session }
            );

            return {
                bid: hiredBid,
                gig: updatedGig,
                rejectedCount: rejectionResult.modifiedCount
            };
        });

        // 8. After transaction commits, emit notifications to all affected users
        
        // Notify the hired freelancer
        if (hiredFreelancer && gigTitle) {
            emitHiredNotification(hiredFreelancer._id.toString(), {
                message: `🎉 Congratulations! You have been hired for "${gigTitle}"!`,
                projectName: gigTitle,
                bidId: bidId,
                gigId: result.gig._id
            });
        }

        // Notify the gig owner
        if (gigOwner && hiredFreelancer && gigTitle) {
            emitAssignedNotification(gigOwner._id.toString(), {
                message: `✅ You have successfully hired ${hiredFreelancer.name} for "${gigTitle}"!`,
                freelancerName: hiredFreelancer.name,
                projectName: gigTitle,
                bidId: bidId,
                gigId: result.gig._id
            });
        }

        // Notify all rejected bidders
        if (rejectedBidUserIds.length > 0 && hiredFreelancer && gigTitle) {
            rejectedBidUserIds.forEach(userId => {
                emitRejectionNotification(userId, {
                    message: `❌ Unfortunately, your bid for "${gigTitle}" was not selected. ${hiredFreelancer.name} has been hired for this project.`,
                    projectName: gigTitle,
                    bidId: bidId,
                    gigId: result.gig._id,
                    hiredFreelancerName: hiredFreelancer.name
                });
            });
        }

        return res.status(200).json({
            message: 'Freelancer hired successfully',
            data: result
        });

    } catch (error) {
        if (error.message.includes('already been assigned') || 
            error.message.includes('status is')) {
            return res.status(409).json({ 
                message: error.message,
                code: 'HIRE_CONFLICT'
            });
        }

        if (error.message === 'Bid not found' || error.message === 'Gig not found') {
            return res.status(404).json({ message: error.message });
        }

        return res.status(500).json({ 
            message: "Error hiring freelancer", 
            error: error.message 
        });
    }
};

module.exports = { createBid, updatedBidStatus, hireBid };