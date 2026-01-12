const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const createGig = require('../controllers/gigController');

const router = express.Router();

router.post("/addGig", authMiddleware, createGig);

module.exports = router;