const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { registrationRules, storeRules } = require('../utils/validationRules');

// All routes here require Admin role
router.use(authenticate, authorize('Admin'));

// User Management
router.get('/users', adminController.getUsers);
router.post('/users', registrationRules, adminController.addUser);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id', registrationRules, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.patch('/users/:id/reset-password', adminController.resetPassword);

// Store Management
router.get('/stores', adminController.getStores);
router.post('/stores', storeRules, adminController.addStore);
router.put('/stores/:id', storeRules, adminController.updateStore);
router.delete('/stores/:id', adminController.deleteStore);
router.get('/stores/:id/ratings', adminController.getStoreRatings);

// Statistics & Analytics
router.get('/stats', adminController.getStats);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
