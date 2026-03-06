const mongoose = require('mongoose');
const PostDetails = require('../../models/user/PostDetails');
const Post = require('../../models/user/Post');

const postLikeDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        const { reaction } = req.body;

        if (!userId)
            return res.status(401).json({ error: "User not authenticated" });

        if (!["like", "dislike"].includes(reaction))
            return res.status(400).json({ error: "Invalid reaction type" });

        // If the ID is not a valid MongoDB ObjectId (e.g. UUID from setpost),
        // we cannot query or create PostDetails for it
        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        let postDetails = await PostDetails.findOne({ postid: postId });

        // Fallback: if not found by postid, try finding by PostDetails _id directly
        if (!postDetails) {
            postDetails = await PostDetails.findById(postId);
        }

        if (!postDetails) {
            postDetails = await PostDetails.create({
                postid: postId,
                likedBy: [],
                dislikedBy: []
            });
        }

        const hasLiked = postDetails.likedBy.some(id => id.toString() === userId);
        const hasDisliked = postDetails.dislikedBy.some(id => id.toString() === userId);

        let userReaction = null;

        if (reaction === "like") {
            if (hasLiked) {
                postDetails.likedBy.pull(userId);
            } else {
                postDetails.likedBy.addToSet(userId);
                postDetails.dislikedBy.pull(userId);
                userReaction = "like";
            }
        }

        if (reaction === "dislike") {
            if (hasDisliked) {
                postDetails.dislikedBy.pull(userId);
            } else {
                postDetails.dislikedBy.addToSet(userId);
                postDetails.likedBy.pull(userId);
                userReaction = "dislike";
            }
        }

        // Sync count fields with array lengths
        postDetails.like = postDetails.likedBy.length;
        postDetails.dislike = postDetails.dislikedBy.length;

        await postDetails.save();

        return res.status(200).json({
            message: "Reaction updated successfully",
            like: postDetails.likedBy.length,
            dislike: postDetails.dislikedBy.length,
            userReaction
        });

    } catch (err) {
        console.error("Reaction Error:", err);
        return res.status(500).json({ error: err.message });
    }
};

const getUserReaction = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        // If the ID is not a valid MongoDB ObjectId (e.g. UUID from setpost),
        // return default reaction data instead of crashing
        if (!mongoose.isValidObjectId(postId)) {
            return res.json({
                userReaction: null,
                like: 0,
                dislike: 0
            });
        }

        let postDetails = await PostDetails.findOne({ postid: postId });

        // Fallback: if not found by postid, try finding by PostDetails _id directly
        if (!postDetails) {
            postDetails = await PostDetails.findById(postId);
        }

        if (!postDetails) {
            return res.json({
                userReaction: null,
                like: 0,
                dislike: 0
            });
        }

        let userReaction = null;

        // Only check user reaction if authenticated
        if (userId) {
            const hasLiked = postDetails.likedBy.some(
                id => id.toString() === userId
            );
            const hasDisliked = postDetails.dislikedBy.some(
                id => id.toString() === userId
            );

            if (hasLiked) userReaction = "like";
            if (hasDisliked) userReaction = "dislike";
        }

        return res.json({
            userReaction,
            like: postDetails.likedBy.length,
            dislike: postDetails.dislikedBy.length
        });

    } catch (err) {
        console.error("Get Reaction Error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { postLikeDetails, getUserReaction };
