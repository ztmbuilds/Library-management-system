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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const config_1 = require("./config");
require("./database/index");
const app_1 = __importDefault(require("./app"));
const cron_1 = require("./cron");
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!💥 Shutting Down....');
    console.log(err.name, err.message);
    process.exit(1);
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    app_1.default.listen(config_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`:::> 🚀 Server ready at http://localhost:${config_1.PORT}`);
        console.log(`:::> 🚀 View swagger documentation at http://localhost:${config_1.PORT}/api/docs`);
    }));
    //cron jobs
    yield (0, cron_1.setupCronJobs)();
});
start();
