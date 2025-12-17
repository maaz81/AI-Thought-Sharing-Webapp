const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, logoutUser } = require('../../controllers/user/userControllers');
const { registerValidation, loginValidation } = require('../../validators/authValidator');
const protectRoutes = require('../../middleware/authMiddleware');

const router = express.Router();

// Rate limiting for auth routes - prevent brute force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiter to login and register
router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);
router.post('/logout', protectRoutes, logoutUser);

module.exports = router;
