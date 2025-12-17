/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 */

/**
 * Custom Application Error class
 * Use this to throw operational errors with specific status codes
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Async handler wrapper to catch async errors
 * Wraps async route handlers to forward errors to the error handler
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Global error handler middleware
 * Should be the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development vs Production error responses
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }

    // Production: don't leak error details
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Programming or unknown error: log and send generic message
    console.error('ERROR 💥:', err);
    return res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
};

/**
 * Handle 404 - Route not found
 */
const notFoundHandler = (req, res, next) => {
    const err = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(err);
};

module.exports = { AppError, catchAsync, errorHandler, notFoundHandler };
