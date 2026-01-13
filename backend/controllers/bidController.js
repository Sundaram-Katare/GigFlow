const Bid = require('../models/bidModel');
const Gig = require('../models/gigModel');
const User = require('../models/userModel');
const { emitHiredNotification } = require('../socket');

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

const hireBid = async (req, res) => {
    try {
        const { bidId } = req.body;
        const bid = await Bid.findById(bidId).populate('gigId');
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        // Update this bid to hired
        await Bid.findByIdAndUpdate(bidId, { status: 'hired' });
        // Update others to rejected
        await Bid.updateMany({ gigId: bid.gigId._id, _id: { $ne: bidId } }, { status: 'rejected' });
        // Update gig to assigned
        await Gig.findByIdAndUpdate(bid.gigId._id, { status: 'assigned' });
        // Emit notification to the freelancer
        emitHiredNotification(bid.userId.toString(), `You have been hired for ${bid.gigId.title}!`);
        return res.status(200).json({ message: 'Hired successfully' });
    } catch (error) {
        return res.status(500).json({ message: "Error hiring bid", error: error.message });
    }
}

module.exports = { createBid, updatedBidStatus, hireBid };