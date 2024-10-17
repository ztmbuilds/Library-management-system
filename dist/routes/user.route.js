"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const jwt_passport_strategy_1 = __importDefault(require("../strategies/jwt.passport.strategy"));
const validation_middleware_1 = __importDefault(require("../middlewares/validation-middleware"));
const user_validation_1 = require("../validation/user.validation");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enums_1 = require("../types/enums");
const router = (0, express_1.Router)();
router.use(jwt_passport_strategy_1.default.authenticate('jwt', { session: false }));
router
    .route('/profile')
    .patch((0, validation_middleware_1.default)(user_validation_1.userUpdateValidationRules), user_controller_1.default.updateProfile)
    .get(user_controller_1.default.getProfile);
router.get('/borrowing-history', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), user_controller_1.default.getBorrowingHistory);
router.get('/reservations', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), user_controller_1.default.getReservations);
router.get('/fines', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), user_controller_1.default.getFines);
exports.default = router;
