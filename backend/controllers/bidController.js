const Bid = require('../models/bidModel');
const Gig = require('../models/gigModel');
const User = require('../models/userModel');
const { emitHiredNotification } = require('../socket');
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
 * Secure hire function using MongoDB transactions
 * Ensures only one freelancer can be hired per gig, even with concurrent requests
 */
const hireBid = async (req, res) => {
    try {
        const { bidId } = req.body;

        if (!bidId) {
            return res.status(400).json({ message: 'Bid ID is required' });
        }

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
            const gig = await Gig.findById(bid.gigId._id).session(session);

            if (!gig) {
                throw new Error('Gig not found');
            }

            // 3. Critical check: Ensure gig is still in 'open' status
            // This prevents hiring if another admin already hired someone
            if (gig.status !== 'open') {
                throw new Error('This gig has already been assigned to another freelancer');
            }

            if (gig.hiredFreelancerId && gig.hiredFreelancerId.toString() !== bid.userId._id.toString()) {
                throw new Error('Another freelancer has already been hired for this gig');
            }

            // 4. Update the bid to 'hired' status with timestamp
            const hiredBid = await Bid.findByIdAndUpdate(
                bidId,
                { 
                    status: 'hired',
                    hiredAt: new Date()
                },
                { new: true, session }
            );

            // 5. Update the gig to 'assigned' status and set the hired freelancer
            const updatedGig = await Gig.findByIdAndUpdate(
                bid.gigId._id,
                { 
                    status: 'assigned',
                    hiredFreelancerId: bid.userId._id,
                    $inc: { version: 1 } // Increment version for optimistic locking
                },
                { new: true, session }
            );

            // 6. Reject all other bids for this gig in a single operation
            const rejectedBids = await Bid.updateMany(
                { 
                    gigId: bid.gigId._id,
                    _id: { $ne: bidId },
                    status: 'pending' // Only reject pending bids
                },
                { status: 'rejected' },
                { session }
            );

            return {
                bid: hiredBid,
                gig: updatedGig,
                rejectedCount: rejectedBids.modifiedCount
            };
        });

        // 7. After transaction commits successfully, emit notifications
        const bid = await Bid.findById(bidId).populate('userId');
        const gig = await Gig.findById(bid.gigId);
        
        // Notify the hired freelancer
        emitHiredNotification(
            bid.userId._id.toString(),
            `You have been hired for "${gig.title}"!`
        );

        // Notify the gig owner
        emitHiredNotification(
            gig.userId.toString(),
            `You have successfully hired ${bid.userId.name} for "${gig.title}"!`
        );

        return res.status(200).json({
            message: 'Freelancer hired successfully',
            data: result
        });

    } catch (error) {
        // Handle specific errors
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