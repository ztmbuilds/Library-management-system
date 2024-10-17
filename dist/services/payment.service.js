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
const paystack_sdk_1 = require("paystack-sdk");
const payment_model_1 = __importDefault(require("../models/payment.model"));
const config_1 = require("../config");
const fine_service_1 = require("./fine.service");
const error_middleware_1 = require("../middlewares/error.middleware");
class PaymentService {
    constructor() {
        this.paystack = new paystack_sdk_1.Paystack(config_1.PAYSTACK_SECRET_KEY);
    }
    initializePayment(fineId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const fine = yield fine_service_1.FineService.getFine(fineId);
                if (!fine)
                    throw new error_middleware_1.AppError('No fine with that id found', 404);
                const payload = {
                    email: fine.userId.email,
                    amount: `${fine.amount * 100}`, // Paystack expects amount in kobo
                    currency: 'NGN',
                };
                const response = yield this.paystack.transaction.initialize(payload);
                yield payment_model_1.default.create({
                    fineId,
                    amount: fine.amount,
                    status: 'pending',
                    transaction_refrence: (_a = response.data) === null || _a === void 0 ? void 0 : _a.reference,
                });
                return response.data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    verifyPaymentWebhook(event) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const reference = (_a = event.data) === null || _a === void 0 ? void 0 : _a.offline_reference;
                const status = ((_b = event.data) === null || _b === void 0 ? void 0 : _b.status) === 'success' ? 'completed' : 'failed';
                const payment = yield payment_model_1.default.findOne({
                    transaction_refrence: reference,
                });
                if (!payment)
                    throw new error_middleware_1.AppError('No payment with that transaction reference found', 404);
                payment.status = status;
                yield payment.save();
            }
            catch (err) {
                throw err;
            }
        });
    }
    verifyPayment(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.paystack.transaction.verify(reference);
            const payment = yield payment_model_1.default.findOne({
                transaction_refrence: reference,
            }).populate('fineId');
            if (!payment)
                throw new error_middleware_1.AppError('No payment with that transaction reference found', 404);
            switch ((_a = response.data) === null || _a === void 0 ? void 0 : _a.status) {
                case 'success':
                    payment.status = 'completed';
                    payment.fineId.status = 'PAID';
                    break;
                case 'failed':
                    payment.status = 'failed';
                    break;
                default:
                    payment.status = 'pending';
                    break;
            }
            yield payment.save();
            yield payment.fineId.save();
            return payment;
        });
    }
}
exports.default = new PaymentService();
