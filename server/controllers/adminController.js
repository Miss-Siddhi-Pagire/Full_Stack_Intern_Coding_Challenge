const pool = require('../config/db');
const Store = require('../models/storeModel');
const User = require('../models/userModel');
const Rating = require('../models/ratingModel');
const { hashPassword } = require('../utils/passwordUtils');
const { validationResult } = require('express-validator');

const addStore = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, address, email, owner_id } = req.body;
    const storeId = await Store.create({ name, address, email, owner_id });
    res.status(201).json({ success: true, message: 'Store added successfully', data: { storeId } });
  } catch (err) { next(err); }
};

const updateStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, email, owner_id } = req.body;
    const success = await Store.update(id, { name, address, email, owner_id });
    if (!success) return res.status(404).json({ success: false, message: 'Store not found' });
    res.status(200).json({ success: true, message: 'Store updated successfully' });
  } catch (err) { next(err); }
};

const deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await Store.softDelete(id);
    if (!success) return res.status(404).json({ success: false, message: 'Store not found' });
    res.status(200).json({ success: true, message: 'Store deleted successfully' });
  } catch (err) { next(err); }
};

const addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, password, address, role } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });
    const hashedPassword = await hashPassword(password);
    const userId = await User.create({ name, email, password: hashedPassword, address, role: role || 'User' });
    res.status(201).json({ success: true, message: 'User added successfully', data: { userId } });
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, address, role, status } = req.body;
    const success = await User.update(id, { name, email, address, role, status });
    if (!success) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await User.softDelete(id);
    if (!success) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) { next(err); }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const success = await User.updateStatus(id, status);
    if (!success) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: `User status updated to ${status}` });
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users WHERE is_deleted = FALSE');
    const [storeCount] = await pool.query('SELECT COUNT(*) as total FROM stores WHERE is_deleted = FALSE');
    const [ratingCount] = await pool.query('SELECT COUNT(*) as total FROM ratings');
    res.status(200).json({ success: true, data: { totalUsers: userCount[0].total, totalStores: storeCount[0].total, totalRatings: ratingCount[0].total } });
  } catch (err) { next(err); }
};

const getStores = async (req, res, next) => {
  try {
    const result = await Store.findAll(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

const getUsers = async (req, res, next) => {
  try {
    const result = await User.findAll(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    let extraData = {};
    if (user.role === 'Store Owner') {
      const store = await Store.findByOwnerId(user.id);
      if (store) {
        const stats = await Store.getStats(store.id);
        extraData = { storeName: store.name, averageRating: stats.averageRating || 0 };
      }
    }
    res.status(200).json({ success: true, data: { ...user, ...extraData } });
  } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await hashPassword(password);
    const success = await User.updatePassword(id, hashedPassword);
    if (!success) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) { next(err); }
};

const getStoreRatings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ratings = await Store.getRatings(id);
    res.status(200).json({ success: true, data: ratings });
  } catch (err) { next(err); }
};

const getAnalytics = async (req, res, next) => {
  try {
    const trends = await Rating.getTrends();
    const distribution = await Rating.getDistribution();
    res.status(200).json({ success: true, data: { trends, distribution } });
  } catch (err) { next(err); }
};

module.exports = {
  addStore, updateStore, deleteStore,
  addUser, updateUser, deleteUser, updateUserStatus,
  getStats, getStores, getUsers, getUserDetails, getStoreRatings, getAnalytics, resetPassword
};
