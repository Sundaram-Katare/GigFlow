const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createBid, hireBid } = require('../controllers/bidController');

const router = express.Router();

router.post("/addBid", authMiddleware, createBid);
router.put("/hireBid", authMiddleware, hireBid);

module.exports = router;