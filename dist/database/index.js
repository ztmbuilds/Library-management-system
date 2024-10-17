"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
if (!config_1.MONGO_URL) {
    throw new Error('MONGO_URL must be defined');
}
mongoose_1.default
    .connect(config_1.MONGO_URL)
    .then(() => {
    console.log(`:::>  Database connected`);
})
    .catch((err) => {
    console.error(':::>  Error connecting to database: ', err);
});
