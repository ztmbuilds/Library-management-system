"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fine_controller_1 = __importDefault(require("../controllers/fine.controller"));
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post('/:id/initiate-payment', fine_controller_1.default.initiateFinePayment);
//Webhook endpoint
router.post('/verify', fine_controller_1.default.verifyFinePayment);
router.use(passport_1.default.authenticate('jwt', { session: false }));
router.get('/:id', fine_controller_1.default.getFine);
exports.default = router;
