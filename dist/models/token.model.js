"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'user',
    },
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['reset_password', 'verify_email', 'refresh_token'],
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});
exports.default = mongoose_1.default.model('token', tokenSchema);
