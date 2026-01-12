const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createGig, getAllGigs, getAllGigsOfSingleUser, updateStatusOfGig, getAllBidsOfGig } = require('../controllers/gigController');
const { updatedBidStatus } = require('../controllers/bidController');

const router = express.Router();

router.post("/addGig", authMiddleware, createGig);
router.get("/getAllGigs", getAllGigs);
router.get("/getAllGigsOfSingleUser", authMiddleware, getAllGigsOfSingleUser);
router.put("/updateStatus/:id", authMiddleware, updateStatusOfGig, updatedBidStatus);
router.get("/getAllBids", authMiddleware, getAllBidsOfGig);

module.exports = router;