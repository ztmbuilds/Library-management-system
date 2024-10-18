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
const bull_1 = __importDefault(require("bull"));
const config_1 = require("../config");
const email_service_1 = __importDefault(require("../services/email.service"));
const emailQueue = new bull_1.default('email', config_1.REDIS_URL);
emailQueue.process((job, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield new email_service_1.default(job.data.user).sendMail(job.data.subject, job.data.message, job.data.receipient);
    job.progress(100);
    done();
}));
exports.default = emailQueue;
