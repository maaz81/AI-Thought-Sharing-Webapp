const express = require('express');
const { getPosts, createPosts, searchBar} = require('../controlllers/postControllers');
const protectRoutes = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/post', getPosts);

router.post('/post/create',protectRoutes, createPosts);

router.get('/search',searchBar);


module.exports = router;
