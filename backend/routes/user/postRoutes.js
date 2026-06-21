const express = require('express');
const { getPosts, getSpecificPost, createPosts, searchBar, getHomeFeed } = require('../../controllers/user/postControllers');
const { createPostValidation, searchValidation, postIdValidation } = require('../../validators/postValidator');
const protectRoutes = require('../../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/post', getPosts);
router.get('/post/:postId', postIdValidation, getSpecificPost);
router.get('/search', searchValidation, searchBar);
router.get('/feed', getHomeFeed);

// Protected routes
router.post('/post/create', protectRoutes, createPostValidation, createPosts);

module.exports = router;
