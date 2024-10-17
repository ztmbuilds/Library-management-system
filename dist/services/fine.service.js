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
exports.FineService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const error_middleware_1 = require("../middlewares/error.middleware");
const Fine_model_1 = __importDefault(require("../models/Fine.model"));
const borrowing_model_1 = __importDefault(require("../models/borrowing.model"));
class FineService {
    static createFine(borrowingId, reason, amount, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const borrowingRecord = yield borrowing_model_1.default.findById(borrowingId);
            if (!borrowingRecord)
                throw new error_middleware_1.AppError('Borrowing record not found', 404);
            const newFine = yield Fine_model_1.default.create({
                borrowingId,
                userId: borrowingRecord.userId,
                reason,
                amount,
                description,
            });
            yield newFine.save();
            return newFine;
        });
    }
    static calculateOverdueFine(borrowingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const borrowingRecord = yield borrowing_model_1.default.findById(borrowingId);
            if (!borrowingRecord)
                throw new error_middleware_1.AppError('Borrowing record not found', 404);
            const daysLate = (0, dayjs_1.default)().diff(borrowingRecord.returnDate, 'day');
            const amount = daysLate * this.DAILY_OVERDUE_RATE;
            return this.createFine(borrowingRecord.id, 'OVERDUE', amount, `${daysLate} days overdue`);
        });
    }
    static updateOverdueFine() {
        return __awaiter(this, void 0, void 0, function* () {
            const overdueBorrowings = yield borrowing_model_1.default.find({
                returned: false,
                returnDate: { $lt: new Date() },
            }).populate({
                path: 'fines',
                match: { reason: 'OVERDUE', status: 'PENDING' }, //will return an empty array if there are no matches
            });
            for (let borrowing of overdueBorrowings) {
                if (borrowing.fines.length > 0) {
                    const daysLate = (0, dayjs_1.default)().diff(borrowing.returnDate, 'day');
                    borrowing.fines[0].amount = daysLate * this.DAILY_OVERDUE_RATE;
                    yield borrowing.save();
                }
                else {
                    yield this.calculateOverdueFine(borrowing.id);
                }
            }
        });
    }
    static createDamagedBookFine(borrowingId, description) {
        return this.createFine(borrowingId, 'DAMAGED', this.DAMAGED_BOOK_FEE, description);
    }
    static createLostBookFine(borrowingId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createFine(borrowingId, 'LOST', this.LOST_BOOK_FEE, description);
        });
    }
    static getAllUserFines(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fines = yield Fine_model_1.default.find({ userId });
            return fines;
        });
    }
    static getFine(fineId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fine = yield Fine_model_1.default.findById(fineId).populate('userId');
            return fine;
        });
    }
}
exports.FineService = FineService;
// In Naira
FineService.DAILY_OVERDUE_RATE = 100;
FineService.DAMAGED_BOOK_FEE = 2000;
FineService.LOST_BOOK_FEE = 10000;
