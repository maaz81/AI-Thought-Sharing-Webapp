const jwt = require('jsonwebtoken');
const envSecret = require('../config/env');

/**
 * Optional authentication middleware.
 * If a valid JWT token is present, sets req.userId.
 * If no token or invalid token, continues without setting userId.
 */
const optionalAuth = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.userId = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, envSecret.JWT_SECRET);
        req.userId = decoded.id;
    } catch (error) {
        req.userId = null;
    }

    next();
};

module.exports = optionalAuth;
