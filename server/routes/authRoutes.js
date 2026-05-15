const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registrationRules } = require('../utils/validationRules');

router.post('/register', registrationRules, authController.register);

module.exports = router;
