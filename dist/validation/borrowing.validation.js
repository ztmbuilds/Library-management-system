"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportDamagedOrLostValidationRules = exports.renewBookValidationRules = void 0;
const express_validator_1 = require("express-validator");
const dayjs_1 = __importDefault(require("dayjs"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(utc_1.default);
exports.renewBookValidationRules = [
    (0, express_validator_1.body)('newReturnDate')
        .trim()
        .notEmpty()
        .withMessage('newReturnDate is required')
        .customSanitizer((value) => {
        return dayjs_1.default.utc(value, 'YYYY-MM-DD');
    })
        .custom((value) => {
        if (!value.isValid()) {
            throw new Error('Invalid date format. Use YYYY-MM-DD.');
        }
        const today = dayjs_1.default.utc().startOf('day');
        console.log(value, today);
        if (value.isBefore(today)) {
            throw new Error('return date must not be before today');
        }
        return true;
    }),
];
exports.reportDamagedOrLostValidationRules = [
    (0, express_validator_1.body)('description').trim().notEmpty().withMessage('description is required'),
];
