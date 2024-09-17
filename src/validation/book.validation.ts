import { body, param } from 'express-validator';
import dayjs, { Dayjs } from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(tz);
dayjs.extend(utc);

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

export const borrowBookValidationRules = [
  body('returnDate')
    .notEmpty()
    .withMessage('return date is required')
    .customSanitizer((value: string) => {
      return dayjs.utc(value, 'YYYY-MM-DD');
    })
    .custom((value: Dayjs) => {
      const today = dayjs.utc().startOf('day');

      console.log(value, today);
      if (value.isBefore(today)) {
        throw new Error('return date must not be before today');
      }
      return true;
    }),
];
