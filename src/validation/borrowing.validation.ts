import { body, param } from 'express-validator';
import dayjs, { Dayjs } from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(tz);
dayjs.extend(utc);

export const renewBookValidationRules = [
  body('newReturnDate')
    .trim()
    .notEmpty()
    .withMessage('newReturnDate is required')
    .customSanitizer((value: string) => {
      return dayjs.utc(value, 'YYYY-MM-DD');
    })
    .custom((value: Dayjs) => {
      if (!value.isValid()) {
        throw new Error('Invalid date format. Use YYYY-MM-DD.');
      }
      const today = dayjs.utc().startOf('day');

      console.log(value, today);
      if (value.isBefore(today)) {
        throw new Error('return date must not be before today');
      }
      return true;
    }),
];

export const reportDamagedOrLostValidationRules = [
  body('description').trim().notEmpty().withMessage('description is required'),
];
