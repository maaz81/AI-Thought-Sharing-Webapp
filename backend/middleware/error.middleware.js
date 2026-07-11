const AppError = require('../utils/AppError');
const logger = require('../config/logger');

const handleJWTError = () =>
    new AppError('Invalid authentication token', 401);

const handleJWTExpiredError = () =>
    new AppError('Authentication token expired', 401);

const handleCastErrorDB = (err) =>
    new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue ? Object.values(err.keyValue)[0] : '';

    return new AppError(
        `${value} already exists`,
        409
    );
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(
        (el) => el.message
    );

    return new AppError(
        errors.join(', '),
        400
    );
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    logger.error({
        type: 'APPLICATION_ERROR',
        message: err.message,
        stack: err.stack,
        name: err.name,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });

    return res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }

    let error = err;

    if (err.name === 'CastError')
        error = handleCastErrorDB(err);

    if (err.code === 11000)
        error = handleDuplicateFieldsDB(err);

    if (err.name === 'ValidationError')
        error = handleValidationErrorDB(err);

    if (err.name === 'JsonWebTokenError')
        error = handleJWTError();

    if (err.name === 'TokenExpiredError')
        error = handleJWTExpiredError();

    sendErrorProd(error, res);
};

module.exports = errorHandler;