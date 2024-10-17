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
const reservation_service_1 = require("../services/reservation.service");
class ReservationController {
    createReservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservation = yield new reservation_service_1.ReservationService(req.user).create(req.params.id);
                res.status(201).json({
                    message: 'Reservation created successfully',
                    reservation,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    cancelReservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new reservation_service_1.ReservationService(req.user).cancelReservation(req.params.id);
                res.sendStatus(204);
            }
            catch (err) {
                next(err);
            }
        });
    }
    claimReservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const borrowRecord = yield new reservation_service_1.ReservationService(req.user).claimReservation(req.params.id, req.body.returnDate);
                res.status(200).json({
                    message: 'reservation claimed and book borrowed successfully',
                    borrowRecord,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new ReservationController();
