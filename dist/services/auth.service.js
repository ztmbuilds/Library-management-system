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
const config_1 = require("../config");
const error_middleware_1 = require("../middlewares/error.middleware");
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = require("bcryptjs");
const http_status_1 = __importDefault(require("http-status"));
const crypto_1 = __importDefault(require("crypto"));
const token_model_1 = __importDefault(require("../models/token.model"));
const generate_otp_1 = require("../utils/generate-otp");
const email_service_1 = __importDefault(require("./email.service"));
class AuthService {
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = data;
                const existingUser = yield user_model_1.User.findOne({ email });
                if (existingUser) {
                    throw new error_middleware_1.AppError('User already exists', http_status_1.default.CONFLICT);
                }
                const newUser = new user_model_1.User({
                    username,
                    email,
                    password,
                });
                yield newUser.save();
                return {
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                        role: newUser.role,
                    },
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    requestEmailVerification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findOne({ email });
                if (!user)
                    throw new error_middleware_1.AppError('User does not exist', 404);
                if (user.isVerified)
                    throw new error_middleware_1.AppError('User is already verified', 400);
                const verifyToken = (0, generate_otp_1.generateOtp)();
                const hashedToken = yield (0, bcryptjs_1.hash)(verifyToken, 10);
                const expiresAt = Date.now() + 1000 * 60 * 15;
                yield token_model_1.default.create({
                    userId: user.id,
                    token: hashedToken,
                    type: 'verify_email',
                    expiresAt,
                });
                yield new email_service_1.default(user).sendEmailVerificationOTPMail(verifyToken);
                return new Date(expiresAt);
            }
            catch (err) {
                throw err;
            }
        });
    }
    verifyEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, verifyToken } = data;
            try {
                const user = yield user_model_1.User.findById(userId);
                if (!user)
                    throw new error_middleware_1.AppError('User not found', 404);
                if (user.isVerified)
                    throw new error_middleware_1.AppError('Email already verified', 409);
                const token = yield token_model_1.default.findOne({ type: 'verify_email', userId });
                if (!token)
                    throw new error_middleware_1.AppError('Invalid or expired verification token', 400);
                if (token.expiresAt < new Date(Date.now()))
                    throw new error_middleware_1.AppError('Invalid or expired verification token', 400);
                const isValid = (0, bcryptjs_1.compare)(verifyToken, token.token);
                if (!isValid)
                    throw new error_middleware_1.AppError('Invalid or expired verification token', 400);
                user.isVerified = true;
                yield user.save();
                yield token.deleteOne();
                yield new email_service_1.default(user).sendVerificationSuccessMail();
            }
            catch (err) {
                throw err;
            }
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username_or_email, password } = data;
                const user = yield user_model_1.User.findOne({
                    $or: [{ email: username_or_email }, { username: username_or_email }],
                });
                if (!user) {
                    console.log(user);
                    throw new error_middleware_1.AppError('Invalid credentials', 401);
                }
                const isCorrect = yield (0, bcryptjs_1.compare)(password, user.password);
                if (!isCorrect)
                    throw new error_middleware_1.AppError('Invalid credentials', 401);
                console.log(user.id);
                const { accessToken, refreshToken } = yield this.generateAuthTokens(user.id);
                return {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    },
                    accessToken,
                    refreshToken,
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    generateAuthTokens(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = jsonwebtoken_1.default.sign({ id }, config_1.JWT_SECRET, { expiresIn: '1d' });
                const refreshToken = crypto_1.default.randomBytes(32).toString('hex');
                const hashedRefreshToken = yield (0, bcryptjs_1.hash)(refreshToken, 10);
                const refreshTokenJWT = jsonwebtoken_1.default.sign({ id, refreshToken }, config_1.JWT_SECRET, {
                    expiresIn: '7d',
                });
                yield token_model_1.default.create({
                    userId: id,
                    token: hashedRefreshToken,
                    type: 'refresh_token',
                    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
                });
                return { accessToken, refreshToken: refreshTokenJWT };
            }
            catch (err) {
                throw err;
            }
        });
    }
    refreshAccessToken(refreshTokenJWT) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and verify the refresh token JWT
                const decoded = jsonwebtoken_1.default.verify(refreshTokenJWT, config_1.JWT_SECRET);
                console.log(decoded);
                const { id, refreshToken } = decoded;
                const user = yield user_model_1.User.findById(id);
                if (!user)
                    throw new error_middleware_1.AppError('User does not exist', 404);
                // Check if the refresh token is valid
                const hashedRefreshTokens = yield token_model_1.default.find({
                    userId: id,
                    type: 'refresh_token',
                });
                if (hashedRefreshTokens.length === 0)
                    throw new error_middleware_1.AppError('Invalid or expired refresh token', 401);
                let tokenExists = false;
                for (const token of hashedRefreshTokens) {
                    const isValid = yield (0, bcryptjs_1.compare)(refreshToken, token.token);
                    if (isValid) {
                        tokenExists = true;
                        break;
                    }
                }
                if (!tokenExists)
                    throw new error_middleware_1.AppError('Invalid or expired refresh token', 401);
                // Issue new access token and refresh token
                const accessToken = jsonwebtoken_1.default.sign({ id }, config_1.JWT_SECRET, { expiresIn: '1d' });
                // Generate and hash new refresh token
                const refreshTokenNew = crypto_1.default.randomBytes(32).toString('hex');
                const hashedRefreshTokenNew = yield (0, bcryptjs_1.hash)(refreshTokenNew, 10);
                const refreshTokenJWTNew = jsonwebtoken_1.default.sign({ id, refreshToken: refreshTokenNew }, config_1.JWT_SECRET, {
                    expiresIn: '7d',
                });
                yield token_model_1.default.create([
                    {
                        userId: id,
                        token: hashedRefreshTokenNew,
                        type: 'refresh_token',
                        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
                    },
                ]);
                return { accessToken, refreshTokenJWTNew };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = new AuthService();
