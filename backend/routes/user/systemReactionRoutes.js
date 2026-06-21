const express = require("express");

const protectRoutes = require(
    "../../middleware/authMiddleware"
);

const {
    toggleSystemReaction,
    getSystemReaction,
} = require(
    "../../controllers/user/systemReactionController"
);

const router = express.Router();

router.get(
    "/system-like/:systemPostId",
    protectRoutes,
    getSystemReaction
);

router.post(
    "/system-like/:systemPostId",
    protectRoutes,
    toggleSystemReaction
);

module.exports = router;