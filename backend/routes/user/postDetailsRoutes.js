const express = require('express');
const protectRoutes = require('../../middleware/authMiddleware');
const { postLikeDetails, getUserReaction } = require('../../controllers/user/postDetailsControllers');

const router = express.Router();

router.post('/like/:id',protectRoutes, postLikeDetails);
router.get('/like/',protectRoutes, getUserReaction);

module.exports = router;