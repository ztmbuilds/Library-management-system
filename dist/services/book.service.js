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
const book_model_1 = __importDefault(require("../models/book.model"));
const features_1 = __importDefault(require("../utils/features"));
const error_middleware_1 = require("../middlewares/error.middleware");
const borrowing_service_1 = require("./borrowing.service");
class BookService {
    createBook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBook = yield book_model_1.default.create(book);
                return newBook;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getBook(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_model_1.default.findById(bookId);
                if (!book)
                    throw new error_middleware_1.AppError('No book with that ID found', 404);
                return book;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAllBooks(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const features = new features_1.default(book_model_1.default.find(), query)
                    .filter()
                    .sort()
                    .limitFields()
                    .paginate();
                const books = yield features.query;
                return books;
            }
            catch (err) {
                throw err;
            }
        });
    }
    editBook(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_model_1.default.findByIdAndUpdate(id, data, {
                    new: true,
                });
                if (!book)
                    throw new error_middleware_1.AppError('No book with that ID found', 404);
                return book;
            }
            catch (err) {
                throw err;
            }
        });
    }
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_model_1.default.findByIdAndDelete(id);
                if (!book)
                    throw new error_middleware_1.AppError('No book with that ID found', 404);
            }
            catch (err) {
                throw err;
            }
        });
    }
    returnBook(user, bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_model_1.default.findById(bookId);
                if (!book)
                    throw new error_middleware_1.AppError('No book with that ID found', 404);
                const borrowRecord = yield new borrowing_service_1.BorrowingService(user.id).returnBook(bookId);
                book.availableCopies += 1;
                yield book.save();
                return { borrowRecord, book };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = new BookService();
