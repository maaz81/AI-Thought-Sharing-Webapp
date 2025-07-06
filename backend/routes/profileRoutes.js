const { getUserProfile,getUserPost } = require('../controlllers/profileControllers');
const protectRoutes = require('../middleware/authMiddleware')
const express = require('express');
const router = express.Router();

router.get('/', protectRoutes, getUserProfile);
router.get('/post', protectRoutes, getUserPost);

module.exports = router