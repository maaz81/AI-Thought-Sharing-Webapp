const { getUserProfile, getUserPost, getUserStats, getPublicProfile } = require('../../controllers/user/profileControllers');
const protectRoutes = require('../../middleware/authMiddleware')
const express = require('express');
const router = express.Router();

router.get('/', protectRoutes, getUserProfile);
router.get('/post', protectRoutes, getUserPost);
router.get('/stats', protectRoutes, getUserStats);
router.get('/:username', getPublicProfile); // Public route

module.exports = router