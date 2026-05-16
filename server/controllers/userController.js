const Store = require('../models/storeModel');
const Rating = require('../models/ratingModel');
const User = require('../models/userModel');
const { hashPassword } = require('../utils/passwordUtils');

const getStores = async (req, res, next) => {
  try {
    const result = await Store.findAll({ ...req.query, userId: req.user.id });
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

const submitRating = async (req, res, next) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    await Rating.submit({ user_id, store_id, rating });
    res.status(200).json({ success: true, message: 'Rating submitted successfully' });
  } catch (err) { next(err); }
};

const modifyRating = async (req, res, next) => {
  try {
    const { store_id } = req.params;
    const { rating } = req.body;
    const user_id = req.user.id;
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    const updated = await Rating.update(user_id, store_id, rating);
    if (!updated) return res.status(404).json({ success: false, message: 'Rating not found' });
    res.status(200).json({ success: true, message: 'Rating modified successfully' });
  } catch (err) { next(err); }
};

const updatePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;
    const hashedPassword = await hashPassword(newPassword);
    const updated = await User.updatePassword(userId, hashedPassword);
    if (!updated) return res.status(400).json({ success: false, message: 'Failed to update password' });
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) { next(err); }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, address } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const success = await User.update(userId, { name, email, address, role: user.role, status: user.status });
    if (!success) return res.status(400).json({ success: false, message: 'Failed to update profile' });
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (err) { next(err); }
};

module.exports = {
  getStores, submitRating, modifyRating, updatePassword, getProfile, updateProfile
};
