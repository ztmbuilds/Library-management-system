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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const error_middleware_1 = require("../middlewares/error.middleware");
class EmailService {
    constructor(user) {
        this.user = user;
    }
    sendMail(subject, message, receipient) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: config_1.MAILER.HOST,
                port: config_1.MAILER.PORT,
                auth: {
                    user: config_1.MAILER.USER,
                    pass: config_1.MAILER.PASSWORD,
                },
            });
            const result = yield transporter.sendMail({
                from: `Admin <${config_1.MAILER.USER}>`,
                to: receipient,
                subject,
                text: message,
            });
            if (!result)
                throw new error_middleware_1.AppError('Error sending email', 500);
            return result;
        });
    }
    sendEmailVerificationOTPMail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = 'Email Verification';
            const message = `Hey ${this.user.username}. \n Your OTP is ${token}`;
            const receipient = this.user.email;
            return yield this.sendMail(subject, message, receipient);
        });
    }
    sendVerificationSuccessMail() {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = 'Email Verification Success';
            const message = ` Hey ${this.user.username} Your email has been verified successfully`;
            const receipient = this.user.email;
            return yield this.sendMail(subject, message, receipient);
        });
    }
    sendReservationSuccessMail(bookTitle, bookAuthor) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = 'Reservation Created Successfully';
            const message = `Hey ${this.user.username}, \n Your reservation for  ${bookTitle} by ${bookAuthor} has been created successfully`;
            return yield this.sendMail(subject, message, this.user.email);
        });
    }
    sendReservationCancelMail(bookTitle, bookAuthor) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = 'Reservation Canceled Successfully';
            const message = `Hey ${this.user.username}, \n Your reservation for  ${bookTitle} by ${bookAuthor} has been canceled successfully`;
            return yield this.sendMail(subject, message, this.user.email);
        });
    }
    sendReservationClaimableMail(bookTitle, bookAuthor) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = 'Reservation Claimable';
            const message = `Hey ${this.user.username}, \n Your reservation for ${bookTitle} by ${bookAuthor} is now claimable. Please log in to the library system to claim it.`;
            return yield this.sendMail(subject, message, this.user.email);
        });
    }
}
exports.default = EmailService;
