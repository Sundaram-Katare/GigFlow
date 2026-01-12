const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createGig, getAllGigs, getAllGigsOfSingleUser } = require('../controllers/gigController');

const router = express.Router();

router.post("/addGig", authMiddleware, createGig);
router.get("/getAllGigs", getAllGigs);
router.get("/getAllGigsOfSingleUser", authMiddleware, getAllGigsOfSingleUser);

module.exports = router;