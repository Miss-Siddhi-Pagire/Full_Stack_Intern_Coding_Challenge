const Store = require('../models/storeModel');
const User = require('../models/userModel');
const pool = require('../config/db');

const getStores = async (req, res, next) => {
  try {
    const { name, address, sortBy, order } = req.query;
    const userId = req.user.id;

    const stores = await Store.findAll({ name, address, sortBy, order, userId });

    res.status(200).json({
      success: true,
      data: stores
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStores
};
