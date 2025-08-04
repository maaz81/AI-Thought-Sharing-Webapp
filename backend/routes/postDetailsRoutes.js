const express = require('express');
const protectRoutes = require('../middleware/authMiddleware');
const { postLikeDetails, getLikeDetails, postUpdateDetails, getUpdateDetails, deletePostDetails } = require('../controllers/postDetailsControllers');

const router = express.Router();

router.post('/like/:id',protectRoutes, postLikeDetails);
router.get('/like/',protectRoutes, getLikeDetails);
router.put('/post/:id',protectRoutes, postUpdateDetails);
router.get('/post/:id',protectRoutes, getUpdateDetails);
router.delete('/post/:id',protectRoutes, deletePostDetails);

module.exports = router;