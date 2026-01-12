const Gig = require('../models/gigModel');

const createGig = async(req, res) => {
    try {
       const userId = req.userId;
       const { title, description, budget } = req.body;

       if(!title || !description || !budget) {
        return res.status(400).json({ message: "All fields are required "});
       }

       const newGig = await Gig.create({ userId, title, description, budget });
       newGig.save();

       return res.status(200).json({
        message: "Gig Added Successfully",
        gig: {
            id: newGig._id,
            userId: userId,
            title: newGig.title,
            description: newGig.description,
            budget: newGig.budget,
            status: newGig.status,
            bids: newGig.bids,
        }
       });

    } catch (error) {
        return res.status(500).json({ message: "Error Creating Job", error: error.message });
    }
};

const getAllGigs = async (req, res) => {
    try {  
      const gigs = await Gig.find();

      return res.status(200).json({
        message: "Fetched all gigs successfully",
        gigs
      });
    } catch (error) {
        return res.status(500).json({message: "Error fetching gigs", error: error.message});
    }
}

module.exports = { createGig, getAllGigs};