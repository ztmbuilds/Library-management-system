"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReservationSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    status: {
        type: String,
        enum: ['notified', 'expired', 'claimed', 'pending'],
        default: 'pending',
    },
    expiresAt: Date,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Reservation', ReservationSchema);
