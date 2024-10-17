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
const book_service_1 = __importDefault(require("../services/book.service"));
const borrowing_service_1 = require("../services/borrowing.service");
class BookController {
    createBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_service_1.default.createBook(req.body);
                res.status(201).json({
                    message: 'Book created Successfully',
                    book,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getAllBooks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const books = yield book_service_1.default.getAllBooks(req.query);
                res.status(200).json({
                    books,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_service_1.default.getBook(req.params.id);
                res.status(200).json({
                    book,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    editBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_service_1.default.editBook(req.params.id, req.body);
                res.status(200).json({
                    status: 'success',
                    book,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield book_service_1.default.deleteBook(req.params.id);
                res.status(204).json({
                    status: 'success',
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    borrowBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const borrowRecord = yield new borrowing_service_1.BorrowingService((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).borrowBook(req.params.id, req.body.returnDate);
                res.status(200).json({
                    borrowRecord,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getBorrowingHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const borrowingHistory = yield borrowing_service_1.BorrowingService.getAll(req.query, req.params.id);
                res.status(200).json({
                    borrowingHistory,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new BookController();
