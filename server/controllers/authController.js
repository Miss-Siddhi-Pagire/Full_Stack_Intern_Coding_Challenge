const User = require('../models/userModel');
const { hashPassword } = require('../utils/passwordUtils');
const { validationResult } = require('express-validator');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

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
      message: 'User registered successfully',
      data: { userId }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register
};
