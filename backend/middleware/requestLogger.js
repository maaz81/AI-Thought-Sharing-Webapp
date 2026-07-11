const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        logger.info({
            type: 'REQUEST',
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${Date.now() - start}ms`,
            ip: req.ip
        });
    });

    next();
};

module.exports = requestLogger;