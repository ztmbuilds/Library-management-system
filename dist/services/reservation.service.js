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
exports.ReservationService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const reservation_model_1 = __importDefault(require("../models/reservation.model"));
const book_service_1 = __importDefault(require("./book.service"));
const email_service_1 = __importDefault(require("./email.service"));
const features_1 = __importDefault(require("../utils/features"));
const borrowing_service_1 = require("./borrowing.service");
class ReservationService {
    constructor(user) {
        this.user = user;
    }
    create(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_service_1.default.getBook(bookId);
                if (!book) {
                    throw new error_middleware_1.AppError('No book with that Id found', 404);
                }
                if (book.availableCopies > 0) {
                    throw new error_middleware_1.AppError('You cannot reserve this book as there are available copies', 409);
                }
                const reservation = yield reservation_model_1.default.findOne({
                    userId: this.user.id,
                    bookId,
                });
                if (reservation)
                    throw new error_middleware_1.AppError('You have already created a reservation for  this book', 409);
                const newReservation = yield reservation_model_1.default.create({
                    userId: this.user.id,
                    bookId,
                });
                yield new email_service_1.default(this.user).sendReservationSuccessMail(book.title, book.author);
                return newReservation;
            }
            catch (err) {
                throw err;
            }
        });
    }
    cancelReservation(reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservation = yield reservation_model_1.default.findOne({
                    reservationId,
                    userId: this.user.id,
                });
                if (!reservation) {
                    throw new error_middleware_1.AppError('No reservation with that Id found', 404);
                }
                const book = yield book_service_1.default.getBook(reservation.bookId.toString());
                if (!book) {
                    throw new error_middleware_1.AppError('Book no longer exists', 404);
                }
                yield reservation.deleteOne();
                yield new email_service_1.default(this.user).sendReservationCancelMail(book.title, book.author);
            }
            catch (err) {
                throw err;
            }
        });
    }
    static getAllReservationsForBook(bookId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let reservations;
                if (query) {
                    const features = new features_1.default(reservation_model_1.default.find({ bookId }), query)
                        .filter()
                        .sort()
                        .limitFields()
                        .paginate();
                    reservations = yield features.query;
                }
                reservations = yield reservation_model_1.default.find({ bookId });
                return reservations;
            }
            catch (err) {
                throw err;
            }
        });
    }
    static processNextReservation(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldestReservation = yield reservation_model_1.default.findOne({
                bookId,
                status: 'pending',
            })
                .sort('createdAt')
                .populate(['bookId', 'userId']);
            if (!oldestReservation)
                return;
            const { userId: user, bookId: book } = oldestReservation;
            yield new email_service_1.default(user).sendReservationClaimableMail(book.title, book.author);
            oldestReservation.status = 'notified';
            oldestReservation.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
            yield oldestReservation.save();
        });
    }
    static checkAndUpdateReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            const expiredReservations = yield reservation_model_1.default.find({
                status: 'notified',
                expiresAt: { $lt: new Date() },
            });
            for (let reservation of expiredReservations) {
                reservation.status = 'expired';
                reservation.save();
                yield this.processNextReservation(reservation.bookId);
            }
        });
    }
    getUserReservations(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const features = new features_1.default(reservation_model_1.default.find({ userId: this.user.id }), query)
                    .filter()
                    .sort()
                    .limitFields()
                    .paginate();
                const reservations = yield features.query;
                return reservations;
            }
            catch (err) {
                throw err;
            }
        });
    }
    claimReservation(reservationId, returnDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield reservation_model_1.default.findById(reservationId);
            if (!reservation)
                throw new error_middleware_1.AppError('No reservation with this id found', 404);
            if (reservation.status === 'expired')
                throw new error_middleware_1.AppError('This reservation has expired and cannot be claimed', 409);
            if (reservation.status === 'claimed') {
                throw new error_middleware_1.AppError('This reservation has already been claimed', 409);
            }
            if (reservation.status !== 'notified') {
                throw new error_middleware_1.AppError('This reservation has not been notified and cannot be claimed', 409);
            }
            const borrowRecord = yield new borrowing_service_1.BorrowingService(this.user.id).borrowBook(reservation.bookId, returnDate, true);
            reservation.status = 'claimed';
            yield reservation.save();
            return borrowRecord;
        });
    }
}
exports.ReservationService = ReservationService;
