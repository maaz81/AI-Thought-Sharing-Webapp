/**
 * Post Route Validators
 * Uses express-validator for input validation
 */

const { body, query, param, validationResult } = require('express-validator');

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
 * Create post validation rules
 */
const createPostValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),

    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

    body('tags')
        .isArray({ min: 1 }).withMessage('At least one tag is required')
        .custom((tags) => {
            if (tags.some(tag => typeof tag !== 'string' || tag.trim() === '')) {
                throw new Error('All tags must be non-empty strings');
            }
            return true;
        }),

    body('visibility')
        .optional()
        .isIn(['public', 'private']).withMessage('Visibility must be public or private'),

    validate
];

/**
 * Search validation rules
 * Note: query is optional here since the frontend might send empty initial requests
 * and the controller already handles empty query validation.
 */
const searchValidation = [
    query('query')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Search query must be at most 100 characters'),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),

    validate
];

/**
 * Post ID parameter validation
 * Note: We only check if postId exists. MongoDB validation is handled in controller
 * to provide better error messages.
 */
const postIdValidation = [
    param('postId')
        .notEmpty().withMessage('Post ID is required')
        .isString().withMessage('Post ID must be a string'),

    validate
];

module.exports = { createPostValidation, searchValidation, postIdValidation, validate };
