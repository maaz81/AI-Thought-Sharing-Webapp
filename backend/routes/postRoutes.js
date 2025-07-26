const express = require('express');
const { getPosts, getSpecificPost, createPosts, searchBar} = require('../controlllers/postControllers');
const protectRoutes = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/post', getPosts);

router.get('/post/:postId', getSpecificPost);

router.post('/post/create',protectRoutes, createPosts);

router.get('/search',searchBar);


module.exports = router;
