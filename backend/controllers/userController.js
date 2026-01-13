const User = require('../models/userModel');

const profile = async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId)
        .populate({
          path: 'gigs',
          populate: {
            path: 'bids',
            populate: {
              path: 'userId',
              select: 'name'
            }
          }
        })
        .populate({
          path: 'bids',
          populate: {
            path: 'gigId',
            select: 'title description budget'
          }
        });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Server error in getting profile", error: error.message });
    }
};

module.exports = profile;