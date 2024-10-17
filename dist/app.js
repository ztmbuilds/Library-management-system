"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const jwt_passport_strategy_1 = __importDefault(require("./strategies/jwt.passport.strategy"));
const error_middleware_1 = require("./middlewares/error.middleware");
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const book_route_1 = __importDefault(require("./routes/book.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const reservation_route_1 = __importDefault(require("./routes/reservation.route"));
const borrowing_route_1 = __importDefault(require("./routes/borrowing.route"));
const fine_route_1 = __importDefault(require("./routes/fine.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ credentials: true }));
app.use((0, morgan_1.default)('dev'));
app.use(jwt_passport_strategy_1.default.initialize());
app.use('/api/auth', auth_route_1.default);
app.use('/api/books', book_route_1.default);
app.use('/api/users', user_route_1.default);
app.use('/api/reservations', reservation_route_1.default);
app.use('/api/borrowings', borrowing_route_1.default);
app.use('/api/fines', fine_route_1.default);
const swagDoc = yamljs_1.default.load(path_1.default.join(__dirname, './docs/bundled_doc.yaml'));
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagDoc));
//Handling unhandled routes.
app.all('*', (req, res, next) => {
    next(new error_middleware_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //whatever is passed into next() will be assumed as an err
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
