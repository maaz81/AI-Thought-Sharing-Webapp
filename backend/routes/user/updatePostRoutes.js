const express = require('express');
const protectRoutes = require('../../middleware/authMiddleware');
const { postUpdateDetails, getUpdateDetails, deletePostDetails } = require('../../controllers/user/updatePostControllers');

const router = express.Router();

router.put('/post/:id',protectRoutes, postUpdateDetails);
router.get('/post/:id',protectRoutes, getUpdateDetails);
router.delete('/post/:id',protectRoutes, deletePostDetails);

module.exports = router;