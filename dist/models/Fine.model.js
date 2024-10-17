"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fineSchema = new mongoose_1.default.Schema({
    borrowingId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Borrowing',
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reason: {
        type: String,
        enum: ['OVERDUE', 'DAMAGED', 'LOST', 'OTHER'],
        required: true,
    },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
    paidAt: Date,
    description: String,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Fine', fineSchema);
