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
exports.BorrowingService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_1 = require("mongoose");
const error_middleware_1 = require("../middlewares/error.middleware");
const borrowing_model_1 = __importDefault(require("../models/borrowing.model"));
const reservation_service_1 = require("./reservation.service");
const features_1 = __importDefault(require("../utils/features"));
const fine_service_1 = require("./fine.service");
const book_service_1 = __importDefault(require("./book.service"));
class BorrowingService {
    constructor(userId) {
        this.userId = userId;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const borrowRecord = yield borrowing_model_1.default.findById(id);
                if (!borrowRecord)
                    throw new error_middleware_1.AppError('No borrow record with that id found', 404);
                return borrowRecord;
            }
            catch (err) {
                throw err;
            }
        });
    }
    static getAll(query, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const features = new features_1.default(borrowing_model_1.default.find({
                    $or: [{ userId: id }, { bookId: id }],
                }), query)
                    .filter()
                    .sort()
                    .limitFields()
                    .paginate();
                const borrowingHistory = yield features.query;
                return borrowingHistory;
            }
            catch (err) {
                throw err;
            }
        });
    }
    borrowBook(bookId_1, returnDate_1) {
        return __awaiter(this, arguments, void 0, function* (bookId, returnDate, isReservationClaim = false) {
            try {
                const borrowRecord = yield borrowing_model_1.default.findOne({
                    bookId,
                    userId: this.userId,
                    returned: false,
                });
                if (borrowRecord)
                    throw new error_middleware_1.AppError('This book has already been borrowed by you', 409);
                const book = yield book_service_1.default.getBook(bookId);
                if (book.availableCopies === 0)
                    throw new error_middleware_1.AppError('There are no available copies of this book', 409);
                if (!isReservationClaim) {
                    const reservations = yield reservation_service_1.ReservationService.getAllReservationsForBook(bookId);
                    const activeReservations = reservations.find((el) => el.status === 'notified' || el.status === 'pending');
                    if (activeReservations)
                        throw new error_middleware_1.AppError('Unable to borrow this book due to existing active reservations.', 409);
                }
                const newBorrowRecord = yield borrowing_model_1.default.create({
                    userId: this.userId,
                    bookId,
                    returnDate,
                });
                book.availableCopies -= 1;
                yield book.save();
                return newBorrowRecord;
            }
            catch (err) {
                throw err;
            }
        });
    }
    returnBook(borrowingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const borrowRecord = yield borrowing_model_1.default.findOne({
                    _id: new mongoose_1.Types.ObjectId(borrowingId),
                    userId: this.userId,
                    returned: false,
                }).populate('bookId');
                if (!borrowRecord)
                    throw new error_middleware_1.AppError('No borrow record found', 404);
                borrowRecord.returned = true;
                borrowRecord.actualReturnDate = (0, dayjs_1.default)().toDate();
                const { bookId: book } = borrowRecord;
                book.availableCopies += 1;
                yield book.save();
                yield borrowRecord.save();
                yield reservation_service_1.ReservationService.processNextReservation(book.id);
                return borrowRecord;
            }
            catch (err) {
                throw err;
            }
        });
    }
    renewBook(borrowingId, newReturnDate, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const borrowingRecord = yield borrowing_model_1.default.findOne({
                    _id: new mongoose_1.Types.ObjectId(borrowingId),
                    userId: this.userId,
                    returned: false,
                });
                if (!borrowingRecord)
                    throw new error_middleware_1.AppError('No borrowing record found', 404);
                // if (dayjs(borrowingRecord.returnDate) >= newReturnDate)
                //   throw new AppError(
                //     'New return date cannot be before or on the same day as the existing return date',
                //     422
                //   );
                const reservations = yield reservation_service_1.ReservationService.getAllReservationsForBook(borrowingRecord.bookId, query);
                if (reservations.length !== 0)
                    throw new error_middleware_1.AppError('You cannot renew this book because it has existing reservations', 409);
                borrowingRecord.returnDate = newReturnDate.toDate();
                borrowingRecord.renewed = true;
                yield borrowingRecord.save();
                return borrowingRecord;
            }
            catch (err) {
                throw err;
            }
        });
    }
    reportLost(borrowingId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const borrowingRecord = yield borrowing_model_1.default.findOne({
                    _id: new mongoose_1.Types.ObjectId(borrowingId),
                    userId: this.userId,
                    returned: false,
                });
                if (!borrowingRecord)
                    throw new error_middleware_1.AppError('No borrowing record found', 404);
                const newFine = yield fine_service_1.FineService.createLostBookFine(borrowingRecord.id, description);
                return { borrowingRecord, newFine };
            }
            catch (err) {
                throw err;
            }
        });
    }
    reportDamaged(borrowingId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const borrowingRecord = yield borrowing_model_1.default.findOne({
                    _id: new mongoose_1.Types.ObjectId(borrowingId),
                    userId: this.userId,
                    returned: false,
                });
                if (!borrowingRecord)
                    throw new error_middleware_1.AppError('No borrowing record found', 404);
                const newFine = yield fine_service_1.FineService.createDamagedBookFine(borrowingRecord.id, description);
                return { borrowingRecord, newFine };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.BorrowingService = BorrowingService;
