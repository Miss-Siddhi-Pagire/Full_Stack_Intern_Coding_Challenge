const Store = require('../models/storeModel');

const getStoreStats = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const store = await Store.findByOwnerId(ownerId);

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    const stats = await Store.getStats(store.id);

    res.status(200).json({
      success: true,
      data: {
        storeName: store.name,
        averageRating: stats.averageRating || 0,
        totalRatings: stats.totalRatings
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStoreStats
};
