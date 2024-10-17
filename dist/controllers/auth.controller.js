"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, email } = req.body;
                const { user } = yield auth_service_1.default.signup({
                    username,
                    password,
                    email,
                });
                res.status(201).json({
                    message: 'User created Successfully',
                    user,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username_or_email, password } = req.body;
                const { user, accessToken, refreshToken } = yield auth_service_1.default.login({
                    username_or_email,
                    password,
                });
                res.cookie('refreshToken', refreshToken, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    httpOnly: true,
                });
                res.status(200).json({
                    message: 'User login Sucessful',
                    accessToken,
                    user,
                });
            }
            catch (err) {
                next(err);
                console.log(err);
            }
        });
    }
    refreshAccessToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken, refreshTokenJWTNew } = yield auth_service_1.default.refreshAccessToken(req.cookies.refreshToken);
                res.clearCookie('refreshToken');
                res.cookie('refreshToken', refreshTokenJWTNew, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    httpOnly: true,
                });
                res.status(200).json({
                    message: 'Access Token refreshed successfully',
                    accessToken,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    requestEmailVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expiresAt = yield auth_service_1.default.requestEmailVerification(req.body.email);
                res.status(200).json({
                    message: 'OTP sent to email successfully',
                    expiresAt,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    verifyEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield auth_service_1.default.verifyEmail(req.body);
                res.status(200).json({
                    message: 'Email verified successfully',
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new AuthController();
