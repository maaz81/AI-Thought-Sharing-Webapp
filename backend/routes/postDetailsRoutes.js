const express = require('express');
const protectRoutes = require('../middleware/authMiddleware');
const { postLikeDetails } = require('../controlllers/postDetailsControllers');

const router = express.Router();

router.post('/like/:id',protectRoutes, postLikeDetails);

module.exports = router;