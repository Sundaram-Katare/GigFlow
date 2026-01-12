const express = require('express');
const {register, login } = require('../controllers/authController.js');

const router = express.Router();

console.log(typeof register);

router.post('/register', register);
router.post('/login', login);

module.exports = router;