/**
 * Authentication Route Validators
 * Uses express-validator for input validation
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Register validation rules
 */
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be user or admin'),

    validate
];

/**
 * Login validation rules
 */
const loginValidation = [
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please provide a valid email'),

    body('username')
        .optional()
        .trim(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    // Custom validator: either email or username must be provided
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.username) {
            throw new Error('Email or username is required');
        }
        return true;
    }),

    validate
];

module.exports = { registerValidation, loginValidation, validate };
