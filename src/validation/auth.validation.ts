import { body } from 'express-validator';

export const signupValidationRules = [
  body('username')
    .trim()
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 to 20 characters')
    .notEmpty()
    .withMessage('Username is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .notEmpty()
    .withMessage('Password is required'),
  body('passwordConfirm')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .withMessage('Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password and Password Confirm must be the same');
      }
      return true;
    }),
  body('role')
    .optional()
    .trim()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be a boolean'),
];

export const loginValidationRules = [
  body('username_or_email')
    .trim()
    .notEmpty()
    .custom((value) => {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Simple email regex
      const isValidString = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value); // Valid string with letters and spaces
      if (!isValidEmail && !isValidString) {
        throw new Error(
          'Username or Email must either be a valid username or a valid email'
        );
      }
      return true;
    }),

  body('password').notEmpty(),
];

export const requestEmailVerificationRules = [
  body('email').isEmail().withMessage('Must be a valid email'),
];

export const verifyEmailValidationRules = [
  body('userId').trim().notEmpty().withMessage('userId is required'),
  body('verifyToken')
    .trim()
    .notEmpty()
    .withMessage('verify token is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('verify token must be exactly 6 digits'),
];
