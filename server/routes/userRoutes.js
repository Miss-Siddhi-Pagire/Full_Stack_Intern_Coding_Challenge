const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

// Store interactions
router.get('/stores', userController.getStores);
router.post('/ratings', userController.submitRating);
router.put('/ratings/:store_id', userController.modifyRating);

// Account management
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.updatePassword);

module.exports = router;
