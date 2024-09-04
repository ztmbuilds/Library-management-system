import { body } from 'express-validator';

export const userUpdateValidationRules = [
  body('username')
    .optional()
    .notEmpty()
    .isString()
    .withMessage('Username must be a valid string')
    .custom((value) => {
      if (typeof value !== 'string') {
        throw new Error('Username must be a string');
      }
      return true;
    }),

  body('email')
    .optional()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];
