const express = require('express');
const router = express.Router();
const { getAllPosts } = require('../controllers/setPostControllers');

router.get('/getposts', getAllPosts);

module.exports = router;
