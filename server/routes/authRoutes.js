const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registrationRules, loginRules } = require('../utils/validationRules');

router.post('/register', registrationRules, authController.register);
router.post('/login', loginRules, authController.login);

module.exports = router;
