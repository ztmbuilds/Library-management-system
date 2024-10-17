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
const payment_service_1 = __importDefault(require("../services/payment.service"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const fine_service_1 = require("../services/fine.service");
class FineController {
    initiateFinePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield payment_service_1.default.initializePayment(req.params.id);
                res.status(200).json({
                    data,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    verifyFinePaymentWebhook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash = crypto_1.default
                    .createHmac('sha512', config_1.PAYSTACK_SECRET_KEY)
                    .update(JSON.stringify(req.body))
                    .digest('hex');
                if (hash == req.headers['x-paystack-signature']) {
                    yield payment_service_1.default.verifyPaymentWebhook(req.body);
                }
                res.send(200);
            }
            catch (err) {
                next(err);
            }
        });
    }
    verifyFinePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield payment_service_1.default.verifyPayment(req.params.reference);
                res.status(200).json({
                    payment,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getFine(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fine = yield fine_service_1.FineService.getFine(req.params.id);
                res.status(200).json({
                    fine,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new FineController();
