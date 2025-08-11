const express = require('express');
const router = express.Router();
const { createUserDetails,getUserDetails, getUserPhoto, getUserBio } = require('../../controllers/user/userDetailsControllers');
const protectRoutes = require('../../middleware/authMiddleware');
const upload = require('../../middleware/multer');

// 👇 Use upload.single to handle the photo field
router.post('/update', protectRoutes, upload.single('photo'), createUserDetails);
router.get('/details', protectRoutes, getUserDetails);
router.get('/userphoto', protectRoutes, getUserPhoto);
router.get('/userbio', protectRoutes, getUserBio);

module.exports = router;
