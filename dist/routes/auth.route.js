"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_validation_1 = require("../validation/auth.validation");
const validation_middleware_1 = __importDefault(require("../middlewares/validation-middleware"));
const router = (0, express_1.Router)();
router.post('/signup', (0, validation_middleware_1.default)(auth_validation_1.signupValidationRules), auth_controller_1.default.signup);
router.post('/login', (0, validation_middleware_1.default)(auth_validation_1.loginValidationRules), auth_controller_1.default.login);
router.get('/refresh-access-token', auth_controller_1.default.refreshAccessToken);
router.post('/request-email-verification', (0, validation_middleware_1.default)(auth_validation_1.requestEmailVerificationRules), auth_controller_1.default.requestEmailVerification);
router.post('/verify-email', (0, validation_middleware_1.default)(auth_validation_1.verifyEmailValidationRules), auth_controller_1.default.verifyEmail);
exports.default = router;
