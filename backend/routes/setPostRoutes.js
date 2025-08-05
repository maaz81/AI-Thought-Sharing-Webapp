const express = require('express');
const router = express.Router();
const { getAllPosts, getSpecificPost } = require('../controllers/setPostControllers');

router.get('/getposts', getAllPosts);
router.get('/getposts/:postId', getSpecificPost);

module.exports = router;
