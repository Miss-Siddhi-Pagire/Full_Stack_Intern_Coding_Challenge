const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticate, authorize('Store Owner'));

router.get('/stats', ownerController.getStoreStats);
router.get('/ratings', ownerController.getRatings);
router.get('/analytics', ownerController.getAnalytics);

module.exports = router;
