"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_controller_1 = __importDefault(require("../controllers/reservation.controller"));
const jwt_passport_strategy_1 = __importDefault(require("../strategies/jwt.passport.strategy"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enums_1 = require("../types/enums");
const validation_middleware_1 = __importDefault(require("../middlewares/validation-middleware"));
const book_validation_1 = require("../validation/book.validation");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(jwt_passport_strategy_1.default.authenticate('jwt', { session: false }));
router
    .route('/')
    .post((0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), reservation_controller_1.default.createReservation);
router
    .route('/:id')
    .delete((0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), reservation_controller_1.default.cancelReservation);
router.patch('/:id/claim', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), (0, validation_middleware_1.default)(book_validation_1.borrowBookValidationRules), reservation_controller_1.default.claimReservation);
router.patch('/:id/cancel', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), reservation_controller_1.default.cancelReservation);
exports.default = router;
