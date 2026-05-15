const Store = require('../models/storeModel');
const User = require('../models/userModel');
const { hashPassword } = require('../utils/passwordUtils');

const addStore = async (req, res, next) => {
  try {
    const { name, address, email, owner_id } = req.body;

    const storeId = await Store.create({ name, address, email, owner_id });

    res.status(201).json({
      success: true,
      message: 'Store added successfully',
      data: { storeId }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addStore
};
