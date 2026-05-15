const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// All routes here require Admin role
router.use(authenticate, authorize('Admin'));

router.post('/stores', adminController.addStore);
router.post('/users', adminController.addUser);

module.exports = router;
