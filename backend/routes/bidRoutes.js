const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createBid } = require('../controllers/bidController');

const router = express.Router();

router.post("/addBid", authMiddleware, createBid);

module.exports = router;