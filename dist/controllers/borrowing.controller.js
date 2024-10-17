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
Object.defineProperty(exports, "__esModule", { value: true });
const borrowing_service_1 = require("../services/borrowing.service");
class BorrowingController {
    returnBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const borrowRecord = yield new borrowing_service_1.BorrowingService((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).returnBook(req.params.id);
                res.status(200).json({
                    message: 'Book returned successfully',
                    borrowRecord,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    renewBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const borrowingRecord = yield new borrowing_service_1.BorrowingService((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).renewBook(req.params.id, req.body.newReturnDate, req.query);
                res.status(200).json({
                    message: 'Book renewed successfully',
                    borrowingRecord,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    reportDamangedBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { borrowingRecord, newFine } = yield new borrowing_service_1.BorrowingService((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).reportDamaged(req.params.id, req.body.description);
                res.status(200).json({
                    borrowingRecord,
                    fine: newFine,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    reportLostBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { borrowingRecord, newFine } = yield new borrowing_service_1.BorrowingService((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).reportLost(req.params.id, req.body.description);
                res.status(200).json({
                    borrowingRecord,
                    fine: newFine,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new BorrowingController();
