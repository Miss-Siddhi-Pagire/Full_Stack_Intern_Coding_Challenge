const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/stats', authenticate, authorize('Store Owner'), ownerController.getStoreStats);

module.exports = router;
