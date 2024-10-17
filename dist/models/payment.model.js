"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    fineId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Fine',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        required: true,
    },
    currency: {
        type: String,
        default: 'NGN',
    },
    transaction_refrence: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Payment', paymentSchema);
