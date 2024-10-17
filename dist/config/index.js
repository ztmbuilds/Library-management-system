"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYSTACK_SECRET_KEY = exports.MAILER = exports.NODE_ENV = exports.JWT_SECRET = exports.SESSION_SECRET = exports.MONGO_URL = exports.PORT = void 0;
exports.PORT = process.env.PORT;
exports.MONGO_URL = process.env.MONGO_URL;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.JWT_SECRET = process.env.JWT_SECRET || '';
exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.MAILER = {
    HOST: process.env.MAILER_HOST,
    USER: process.env.MAILER_USER,
    PASSWORD: process.env.MAILER_PASSWORD,
    PORT: process.env.MAILER_PORT,
};
exports.PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
