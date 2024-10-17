"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowBookValidationRules = exports.editBookValidationRules = exports.createBookValidationRules = void 0;
const express_validator_1 = require("express-validator");
const dayjs_1 = __importDefault(require("dayjs"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(utc_1.default);
exports.createBookValidationRules = [
    (0, express_validator_1.body)('title')
        .isString()
        .withMessage('Title must be a string')
        .trim()
        .notEmpty()
        .withMessage('Title is required'),
    (0, express_validator_1.body)('author')
        .isString()
        .withMessage('Author must be a string')
        .trim()
        .notEmpty()
        .withMessage('Author is required'),
    (0, express_validator_1.body)('genre')
        .isString()
        .withMessage('Genre must be a string')
        .trim()
        .notEmpty()
        .withMessage('Genre is required'),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    (0, express_validator_1.body)('available').optional().isBoolean(),
    (0, express_validator_1.body)('totalCopies').isNumeric(),
    (0, express_validator_1.body)('availableCopies')
        .isNumeric()
        .custom((value, { req }) => {
        if (value > req.body.totalCopies) {
            throw new Error('Available copies cannot be more than Total copies');
        }
        return true;
    }),
];
exports.editBookValidationRules = [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Id param is required'),
    (0, express_validator_1.body)('title')
        .optional()
        .isString()
        .withMessage('Title must be a string')
        .trim()
        .notEmpty()
        .withMessage('Title is required'),
    (0, express_validator_1.body)('author')
        .optional()
        .isString()
        .withMessage('Author must be a string')
        .trim()
        .notEmpty()
        .withMessage('Author is required'),
    (0, express_validator_1.body)('genre')
        .optional()
        .isString()
        .withMessage('Genre must be a string')
        .trim()
        .notEmpty()
        .withMessage('Genre is required'),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    (0, express_validator_1.body)('available').optional().isBoolean(),
    (0, express_validator_1.body)('totalCopies').optional().isNumeric(),
    (0, express_validator_1.body)('availableCopies')
        .optional()
        .isNumeric()
        .custom((value, { req }) => {
        if (req.body.totalCopies === undefined) {
            throw new Error('Total copies must be provided before available copies');
        }
        if (value > req.body.totalCopies) {
            throw new Error('Available copies cannot be more than Total copies');
        }
        return true;
    }),
];
exports.borrowBookValidationRules = [
    (0, express_validator_1.body)('returnDate')
        .notEmpty()
        .withMessage('return date is required')
        .customSanitizer((value) => {
        return dayjs_1.default.utc(value, 'YYYY-MM-DD');
    })
        .custom((value) => {
        const today = dayjs_1.default.utc().startOf('day');
        if (value.isBefore(today)) {
            throw new Error('return date must not be before today');
        }
        return true;
    }),
];
