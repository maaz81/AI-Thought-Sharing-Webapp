const { json } = require('express');
const PostDetails = require('../../models/user/PostDetails');
const Post = require('../../models/user/Post');


const postLikeDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        const { reaction } = req.body; // "like" or "dislike"

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        if (!["like", "dislike"].includes(reaction)) {
            return res.status(400).json({ error: "Invalid reaction type" });
        }

        // Find the PostDetails for this post
        let postDetails = await PostDetails.findOne({ postid: postId });

        // Create PostDetails if missing
        if (!postDetails) {
            postDetails = new PostDetails({
                postid: postId,
                likedBy: [],
                dislikedBy: [],
                like: 0,
                dislike: 0
            });
        }

        const hasLiked = postDetails.likedBy.includes(userId);
        const hasDisliked = postDetails.dislikedBy.includes(userId);

        // -------------------------
        //  USER CLICKED LIKE
        // -------------------------
        if (reaction === "like") {
            if (hasLiked) {
                // Remove Like (toggle off)
                postDetails.likedBy = postDetails.likedBy.filter(id => id.toString() !== userId);
            } else {
                // Add Like
                postDetails.likedBy.push(userId);

                // Remove Dislike if exists
                if (hasDisliked) {
                    postDetails.dislikedBy = postDetails.dislikedBy.filter(id => id.toString() !== userId);
                }
            }
        }

        // -------------------------
        //  USER CLICKED DISLIKE
        // -------------------------
        if (reaction === "dislike") {
            if (hasDisliked) {
                // Remove Dislike (toggle off)
                postDetails.dislikedBy = postDetails.dislikedBy.filter(id => id.toString() !== userId);
            } else {
                // Add Dislike
                postDetails.dislikedBy.push(userId);

                // Remove Like if exists
                if (hasLiked) {
                    postDetails.likedBy = postDetails.likedBy.filter(id => id.toString() !== userId);
                }
            }
        }

        // Update counts
        postDetails.like = postDetails.likedBy.length;
        postDetails.dislike = postDetails.dislikedBy.length;

        await postDetails.save();

        return res.status(200).json({
            message: "Reaction updated successfully",
            like: postDetails.like,
            dislike: postDetails.dislike,
            userReaction: reaction
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

        const postDetails = await PostDetails.findOne({ postid: postId });

        if (!postDetails) {
            return res.json({ userReaction: null });
        }

        let userReaction = null;

        if (postDetails.likedBy.includes(userId)) userReaction = "like";
        if (postDetails.dislikedBy.includes(userId)) userReaction = "dislike";

        return res.json({ 
            userReaction,
            like: postDetails.like,
            dislike: postDetails.dislike
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { postLikeDetails, getUserReaction };

// const mongoose = require('mongoose');
// const PostDetails = require('../../models/user/PostDetails');
// const Post = require('../../models/user/Post');

// const postLikeDetails = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const postId = req.params.id;
//     const { reaction } = req.body; // "like" or "dislike"

//     if (!userId) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ error: "Invalid post ID" });
//     }

//     if (!["like", "dislike"].includes(reaction)) {
//       return res.status(400).json({ error: "Invalid reaction type" });
//     }

//     // Ensure post exists (optional but good)
//     const postExists = await Post.findById(postId);
//     if (!postExists) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     // Find PostDetails for this post
//     let postDetails = await PostDetails.findOne({ postId });

//     // Create PostDetails if missing (lazy creation)
//     if (!postDetails) {
//       postDetails = new PostDetails({
//         postId,
//         likedBy: [],
//         dislikedBy: [],
//         like: 0,
//         dislike: 0,
//       });
//     }

//     const hasLiked = postDetails.likedBy.some(
//       (id) => id.toString() === userId.toString()
//     );
//     const hasDisliked = postDetails.dislikedBy.some(
//       (id) => id.toString() === userId.toString()
//     );

//     // LIKE
//     if (reaction === "like") {
//       if (hasLiked) {
//         // toggle off
//         postDetails.likedBy = postDetails.likedBy.filter(
//           (id) => id.toString() !== userId.toString()
//         );
//       } else {
//         // add like
//         postDetails.likedBy.push(userId);

//         // remove dislike if it existed
//         if (hasDisliked) {
//           postDetails.dislikedBy = postDetails.dislikedBy.filter(
//             (id) => id.toString() !== userId.toString()
//           );
//         }
//       }
//     }

//     // DISLIKE
//     if (reaction === "dislike") {
//       if (hasDisliked) {
//         // toggle off
//         postDetails.dislikedBy = postDetails.dislikedBy.filter(
//           (id) => id.toString() !== userId.toString()
//         );
//       } else {
//         // add dislike
//         postDetails.dislikedBy.push(userId);

//         // remove like if it existed
//         if (hasLiked) {
//           postDetails.likedBy = postDetails.likedBy.filter(
//             (id) => id.toString() !== userId.toString()
//           );
//         }
//       }
//     }

//     // Update counts
//     postDetails.like = postDetails.likedBy.length;
//     postDetails.dislike = postDetails.dislikedBy.length;

//     await postDetails.save();

//     // Recalculate current user reaction
//     let userReaction = null;
//     if (postDetails.likedBy.some(id => id.toString() === userId.toString())) {
//       userReaction = "like";
//     } else if (postDetails.dislikedBy.some(id => id.toString() === userId.toString())) {
//       userReaction = "dislike";
//     }

//     return res.status(200).json({
//       message: "Reaction updated successfully",
//       like: postDetails.like,
//       dislike: postDetails.dislike,
//       userReaction,
//     });
//   } catch (err) {
//     console.error("Reaction Error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// const getUserReaction = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const postId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ error: "Invalid post ID" });
//     }

//     const postDetails = await PostDetails.findOne({ postId });

//     if (!postDetails) {
//       return res.json({ userReaction: null, like: 0, dislike: 0 });
//     }

//     let userReaction = null;

//     if (postDetails.likedBy.some(id => id.toString() === userId?.toString())) {
//       userReaction = "like";
//     } else if (postDetails.dislikedBy.some(id => id.toString() === userId?.toString())) {
//       userReaction = "dislike";
//     }

//     return res.json({
//       userReaction,
//       like: postDetails.like,
//       dislike: postDetails.dislike,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { postLikeDetails, getUserReaction };
