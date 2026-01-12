const express = require('express');
const register = require('../controllers/authController.js');

const router = express.Router();

console.log(typeof register);

router.post('/register', register);

module.exports = router;