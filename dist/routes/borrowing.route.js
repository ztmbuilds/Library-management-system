"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const borrowing_controller_1 = __importDefault(require("../controllers/borrowing.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enums_1 = require("../types/enums");
const borrowing_validation_1 = require("../validation/borrowing.validation");
const validation_middleware_1 = __importDefault(require("../middlewares/validation-middleware"));
const jwt_passport_strategy_1 = __importDefault(require("../strategies/jwt.passport.strategy"));
const router = (0, express_1.Router)();
router.use(jwt_passport_strategy_1.default.authenticate('jwt', { session: false }));
router.patch('/:id/return', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), borrowing_controller_1.default.returnBook);
router.patch('/:id/renew', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), (0, validation_middleware_1.default)(borrowing_validation_1.renewBookValidationRules), borrowing_controller_1.default.renewBook);
router.patch('/:id/report-lost', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), (0, validation_middleware_1.default)(borrowing_validation_1.reportDamagedOrLostValidationRules), borrowing_controller_1.default.reportLostBook);
router.patch('/:id/report-damaged', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), (0, validation_middleware_1.default)(borrowing_validation_1.reportDamagedOrLostValidationRules), borrowing_controller_1.default.reportDamangedBook);
exports.default = router;
