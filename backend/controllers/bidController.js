const Bid = require('../models/bidModel');
const Gig = require('../models/gigModel');
const User = require('../models/userModel');

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

       return re.status(200).json({
        message: "Bids Updated Successfully",
        bid,
       });

    } catch (error) {
        return re.status(500).json({ message: "Error updating Bid ", error: error.message });
    }
}

module.exports = { createBid, updatedBidStatus };