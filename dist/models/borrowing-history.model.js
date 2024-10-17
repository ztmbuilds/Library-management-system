"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const borrowingSchema = new mongoose_1.default.Schema({
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
    borrowDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    returnDate: {
        type: Date,
        required: true,
    },
    renewed: {
        type: Boolean,
        default: false,
    },
});
exports.default = mongoose_1.default.model('Borrowing', borrowingSchema);
