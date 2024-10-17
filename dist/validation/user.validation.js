"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidationRules = void 0;
const express_validator_1 = require("express-validator");
exports.userUpdateValidationRules = [
    (0, express_validator_1.body)('username')
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
    (0, express_validator_1.body)('email')
        .optional()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
];
