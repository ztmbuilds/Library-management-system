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
const user_service_1 = __importDefault(require("../services/user.service"));
const borrowing_service_1 = require("../services/borrowing.service");
const reservation_service_1 = require("../services/reservation.service");
const fine_service_1 = require("../services/fine.service");
class UserController {
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield user_service_1.default.update((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body);
                res.status(200).json({
                    user,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield user_service_1.default.get((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.status(200).json({
                    user,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getBorrowingHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const borrowingHistory = yield borrowing_service_1.BorrowingService.getAll(req.query, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.status(200).json({
                    borrowingHistory,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getReservations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservations = yield new reservation_service_1.ReservationService(req.user).getUserReservations(req.query);
                res.status(200).json({
                    reservations,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getFines(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const fines = yield fine_service_1.FineService.getAllUserFines((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.status(200).json({
                    fines,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new UserController();
