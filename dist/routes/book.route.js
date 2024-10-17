"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = __importDefault(require("../controllers/book.controller"));
const book_validation_1 = require("../validation/book.validation");
const validation_middleware_1 = __importDefault(require("../middlewares/validation-middleware"));
const jwt_passport_strategy_1 = __importDefault(require("../strategies/jwt.passport.strategy"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enums_1 = require("../types/enums");
const reservation_route_1 = __importDefault(require("./reservation.route"));
const router = (0, express_1.Router)();
router.use('/:id/reservations', reservation_route_1.default);
router
    .route('/')
    .post(jwt_passport_strategy_1.default.authenticate('jwt', { session: false }), (0, auth_middleware_1.restrictTo)([enums_1.UserRole.ADMIN]), (0, validation_middleware_1.default)(book_validation_1.createBookValidationRules), book_controller_1.default.createBook)
    .get(book_controller_1.default.getAllBooks);
router.use(jwt_passport_strategy_1.default.authenticate('jwt', { session: false }));
router
    .route('/:id')
    .get(book_controller_1.default.getBook)
    .patch((0, auth_middleware_1.restrictTo)([enums_1.UserRole.ADMIN]), (0, validation_middleware_1.default)(book_validation_1.editBookValidationRules), book_controller_1.default.editBook)
    .delete((0, auth_middleware_1.restrictTo)([enums_1.UserRole.ADMIN]), book_controller_1.default.deleteBook);
router.post('/:id/borrow', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.USER]), (0, validation_middleware_1.default)(book_validation_1.borrowBookValidationRules), book_controller_1.default.borrowBook);
router.get('/:id/borrowing-history', (0, auth_middleware_1.restrictTo)([enums_1.UserRole.ADMIN]), book_controller_1.default.getBorrowingHistory);
exports.default = router;
