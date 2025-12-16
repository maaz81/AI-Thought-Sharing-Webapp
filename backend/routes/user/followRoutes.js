const express = require("express");
const router = express.Router();
const followController = require("../../controllers/user/followController");
const auth = require("../../middleware/authMiddleware");

router.post("/follow/:userId", auth, followController.followUser);
router.post("/unfollow/:userId", auth, followController.unfollowUser);

router.get("/followers/:userId", auth, followController.getFollowers);
router.get("/following/:userId", auth, followController.getFollowing);

module.exports = router;
