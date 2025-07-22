const express = require('express');
const router = express.Router();
const { createUserDetails } = require('../controlllers/userDetailsControllers');
const protectRoutes = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// 👇 Use upload.single to handle the photo field
router.post('/update', protectRoutes, upload.single('photo'), createUserDetails);

module.exports = router;
