const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createGig, getAllGigs } = require('../controllers/gigController');

const router = express.Router();

router.post("/addGig", authMiddleware, createGig);
router.get("/getAllGigs", getAllGigs);

module.exports = router;