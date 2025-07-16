const { getUserProfile,getUserPost, getUserStats } = require('../controlllers/profileControllers');
const protectRoutes = require('../middleware/authMiddleware')
const express = require('express');
const router = express.Router();

router.get('/', protectRoutes, getUserProfile);
router.get('/post', protectRoutes, getUserPost);
router.get('/stats', protectRoutes, getUserStats);

module.exports = router