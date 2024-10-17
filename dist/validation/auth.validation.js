"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailValidationRules = exports.requestEmailVerificationRules = exports.loginValidationRules = exports.signupValidationRules = void 0;
const express_validator_1 = require("express-validator");
exports.signupValidationRules = [
    (0, express_validator_1.body)('username')
        .trim()
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 to 20 characters')
        .notEmpty()
        .withMessage('Username is required'),
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Email must be valid')
        .notEmpty()
        .withMessage('Email is required'),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),
    (0, express_validator_1.body)('passwordConfirm')
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
    (0, express_validator_1.body)('role')
        .optional()
        .trim()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),
    (0, express_validator_1.body)('isVerified')
        .optional()
        .isBoolean()
        .withMessage('isVerified must be a boolean'),
];
exports.loginValidationRules = [
    (0, express_validator_1.body)('username_or_email')
        .trim()
        .notEmpty()
        .custom((value) => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Simple email regex
        const isValidString = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value); // Valid string with letters and spaces
        if (!isValidEmail && !isValidString) {
            throw new Error('Username or Email must either be a valid username or a valid email');
        }
        return true;
    }),
    (0, express_validator_1.body)('password').notEmpty(),
];
exports.requestEmailVerificationRules = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Must be a valid email'),
];
exports.verifyEmailValidationRules = [
    (0, express_validator_1.body)('userId').trim().notEmpty().withMessage('userId is required'),
    (0, express_validator_1.body)('verifyToken')
        .trim()
        .notEmpty()
        .withMessage('verify token is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('verify token must be exactly 6 digits'),
];
