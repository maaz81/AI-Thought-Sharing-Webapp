const express = require('express');
const protectRoutes = require('../../middleware/authMiddleware');
const optionalAuth = require('../../middleware/optionalAuth');
const { postLikeDetails, getUserReaction } = require('../../controllers/user/postDetailsControllers');

const router = express.Router();

router.post('/like/:id', protectRoutes, postLikeDetails);
router.get('/like/:id', optionalAuth, getUserReaction);

module.exports = router;