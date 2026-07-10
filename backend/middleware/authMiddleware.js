const jwt = require('jsonwebtoken');
const util = require('util');

const verifyToken = util.promisify(jwt.verify);

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const envSecret = require('../config/env');

const protectRoutes = catchAsync(
    async (req, res, next) => {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            throw new AppError(
                'Unauthorized. Please login.',
                401
            );
        }

        const decoded = await verifyToken(
            token,
            envSecret.JWT_SECRET
        );

        req.userId = decoded.id;

        next();
    }
);

module.exports = protectRoutes;