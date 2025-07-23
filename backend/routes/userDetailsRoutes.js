const express = require('express');
const router = express.Router();
const { createUserDetails,getUserDetails } = require('../controlllers/userDetailsControllers');
const protectRoutes = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// 👇 Use upload.single to handle the photo field
router.post('/update', protectRoutes, upload.single('photo'), createUserDetails);
router.get('/details', protectRoutes, getUserDetails);

module.exports = router;
