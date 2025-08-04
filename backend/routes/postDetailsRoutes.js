const express = require('express');
const protectRoutes = require('../middleware/authMiddleware');
const { postLikeDetails, getLikeDetails } = require('../controllers/postDetailsControllers');

const router = express.Router();

router.post('/like/:id',protectRoutes, postLikeDetails);
router.get('/like/',protectRoutes, getLikeDetails);

module.exports = router;