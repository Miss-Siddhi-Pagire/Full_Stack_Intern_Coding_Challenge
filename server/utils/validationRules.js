const { body } = require('express-validator');

const registrationRules = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must include at least one uppercase letter and one special character')
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const storeRules = [
  body('name')
    .notEmpty().withMessage('Store name is required')
    .isLength({ max: 60 }).withMessage('Store name cannot exceed 60 characters'),
  body('email')
    .isEmail().withMessage('Valid store email is required'),
  body('address')
    .notEmpty().withMessage('Store address is required')
    .isLength({ max: 400 }).withMessage('Store address cannot exceed 400 characters'),
  body('owner_id')
    .notEmpty().withMessage('Owner ID is required')
];

module.exports = {
  registrationRules,
  loginRules,
  storeRules
};
