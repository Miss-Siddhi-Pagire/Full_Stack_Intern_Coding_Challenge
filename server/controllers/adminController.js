const pool = require('../config/db');
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

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'User'
    });

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      data: { userId }
    });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [storeCount] = await pool.query('SELECT COUNT(*) as total FROM stores');
    const [ratingCount] = await pool.query('SELECT COUNT(*) as total FROM ratings');

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount[0].total,
        totalStores: storeCount[0].total,
        totalRatings: ratingCount[0].total
      }
    });
  } catch (err) {
    next(err);
  }
};

const getStores = async (req, res, next) => {
  try {
    const { name, email, address, sortBy, order } = req.query;
    const stores = await Store.findAll({ name, email, address, sortBy, order });

    res.status(200).json({
      success: true,
      data: stores
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;
    const users = await User.findAll({ name, email, address, role, sortBy, order });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let extraData = {};
    if (user.role === 'Store Owner') {
      const store = await Store.findByOwnerId(user.id);
      if (store) {
        const stats = await Store.getStats(store.id);
        extraData = {
          storeName: store.name,
          averageRating: stats.averageRating || 0
        };
      }
    }

    res.status(200).json({
      success: true,
      data: { ...user, ...extraData }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addStore,
  addUser,
  getStats,
  getStores,
  getUsers,
  getUserDetails
};
