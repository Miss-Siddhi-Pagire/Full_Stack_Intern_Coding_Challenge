const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { registrationRules, storeRules } = require('../utils/validationRules');

// All routes here require Admin role
router.use(authenticate, authorize('Admin'));

router.post('/stores', storeRules, adminController.addStore);
router.post('/users', registrationRules, adminController.addUser);
router.get('/stats', adminController.getStats);
router.get('/stores', adminController.getStores);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);

module.exports = router;
