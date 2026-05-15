const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

router.get('/stores', authenticate, userController.getStores);
router.post('/ratings', authenticate, userController.submitRating);

module.exports = router;
