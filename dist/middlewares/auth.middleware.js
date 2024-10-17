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
exports.restrictTo = restrictTo;
const error_middleware_1 = require("./error.middleware");
function restrictTo(roles) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return next(new error_middleware_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    });
}
