"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const config_1 = require("../config");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // this calls the Error class constructor. message is the only parameter that Error accepts
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400); //400 means bad request
};
const handleDuplicateFieldsDB = (err) => {
    const values = Object.values(err.keyValue).map((i) => i);
    const message = `Duplicate value detected --${values.join('.')}--:Please use another value`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again!', 401);
};
const handleJWTExpiredError = () => {
    return new AppError('Your token has expired', 401);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Errors that we know about
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        //1)LOG ERROR
        console.error('ERROR!', err);
        //2) Send Generic message
        res.status(500).json({
            //Unknown Errors.Don't leak details
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};
const errorHandler = (err, req, res, next) => {
    console.log('Inside Error Middleware');
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (config_1.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err); //copy of err
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
exports.errorHandler = errorHandler;
