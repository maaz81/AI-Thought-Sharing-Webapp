const express = require('express');
const { verifyToken, isAdmin } = require('../../middleware/authAdminMiddleware');
const { getAllPost, deletePost } = require('../../controllers/admin/adminPosts');

const router = express.Router();

router.get('/', verifyToken, isAdmin, getAllPost);

router.delete('/:id', verifyToken, isAdmin, deletePost);

module.exports = router;