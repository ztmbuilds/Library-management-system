import { body, param } from 'express-validator';

export const createBookValidationRules = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('author')
    .isString()
    .withMessage('Author must be a string')
    .trim()
    .notEmpty()
    .withMessage('Author is required'),

  body('genre')
    .isString()
    .withMessage('Genre must be a string')
    .trim()
    .notEmpty()
    .withMessage('Genre is required'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('available').optional().isBoolean(),

  body('totalCopies').isNumeric(),

  body('availableCopies')
    .isNumeric()
    .custom((value, { req }) => {
      if (value > req.body.totalCopies) {
        throw new Error('Available copies cannot be more than Total copies');
      }
      return true;
    }),
];

export const editBookValidationRules = [
  param('id').notEmpty().withMessage('Id param is required'),

  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('author')
    .optional()
    .isString()
    .withMessage('Author must be a string')
    .trim()
    .notEmpty()
    .withMessage('Author is required'),

  body('genre')
    .optional()
    .isString()
    .withMessage('Genre must be a string')
    .trim()
    .notEmpty()
    .withMessage('Genre is required'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('available').optional().isBoolean(),

  body('totalCopies').optional().isNumeric(),

  body('availableCopies')
    .optional()
    .isNumeric()
    .custom((value, { req }) => {
      if (req.body.totalCopies === undefined) {
        throw new Error(
          'Total copies must be provided before available copies'
        );
      }
      if (value > req.body.totalCopies) {
        throw new Error('Available copies cannot be more than Total copies');
      }
      return true;
    }),
];

export const deleteBookValidationRules = [
  param('id').notEmpty().withMessage('Id param is required'),
];
