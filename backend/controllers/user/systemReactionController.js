const SystemPostReaction = require(
    "../../models/user/SystemPostReaction"
);

const UserFeed = require(
    "../../models/user/UserFeed"
);

const {
    updateUserInterests,
} = require(
    "../../services/interestService"
);

const {
    getSystemPostById,
} = require(
    "../../utils/systemPostHelper"
);

const toggleSystemReaction = async (
    req,
    res
) => {
    try {
        const { systemPostId } = req.params;

        const { reaction } = req.body;

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (
            !["like", "dislike"].includes(
                reaction
            )
        ) {
            return res.status(400).json({
                message: "Invalid reaction",
            });
        }

        // Upsert to guarantee document exists without duplicate key race conditions
        let postReaction = await SystemPostReaction.findOneAndUpdate(
            { systemPostId },
            { $setOnInsert: { systemPostId } },
            { upsert: true, new: true }
        );

        // Ensure arrays are initialized if Mongoose omitted defaults on upsert
        if (!postReaction.likedBy) postReaction.likedBy = [];
        if (!postReaction.dislikedBy) postReaction.dislikedBy = [];

        const hasLiked =
            postReaction.likedBy.some(
                (id) =>
                    id.toString() === userId
            );

        const hasDisliked =
            postReaction.dislikedBy.some(
                (id) =>
                    id.toString() === userId
            );

        let userReaction = null;

        if (reaction === "like") {

            if (hasLiked) {

                // unlike
                postReaction.likedBy.pull(userId);

            } else {

                // like
                postReaction.likedBy.addToSet(userId);

                // remove dislike if exists
                postReaction.dislikedBy.pull(userId);

                userReaction = "like";

                /*
                 * PHASE 2
                 * Update UserFeed + Interests
                 */

                const systemPost =
                    getSystemPostById(systemPostId);

                if (systemPost) {

                    // Upsert UserFeed safely
                    await UserFeed.findOneAndUpdate(
                        { userId },
                        { $setOnInsert: { userId } },
                        { upsert: true, new: false }
                    );

                    await UserFeed.updateOne(
                        { 
                            userId,
                            'likedPosts.systemPostId': { $ne: systemPostId }
                        },
                        {
                            $push: {
                                likedPosts: {
                                    systemPostId,
                                    source: "system",
                                    tags: systemPost.tags || [],
                                }
                            }
                        }
                    );

                    await updateUserInterests(
                        userId,
                        systemPost.tags || [],
                        "like"
                    );
                }
            }
        }

        if (reaction === "dislike") {
            if (hasDisliked) {
                postReaction.dislikedBy.pull(
                    userId
                );
            } else {
                postReaction.dislikedBy.addToSet(
                    userId
                );

                postReaction.likedBy.pull(
                    userId
                );

                userReaction = "dislike";
            }
        }

        postReaction.like =
            postReaction.likedBy.length;

        postReaction.dislike =
            postReaction.dislikedBy.length;

        await postReaction.save();

        return res.status(200).json({
            message:
                "Reaction updated successfully",

            like: postReaction.like,
            dislike:
                postReaction.dislike,

            userReaction,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: err.message,
        });
    }
};

const getSystemReaction = async (
    req,
    res
) => {
    try {
        const { systemPostId } = req.params;

        const userId = req.userId;

        const reaction =
            await SystemPostReaction.findOne({
                systemPostId,
            });

        if (!reaction) {
            return res.json({
                like: 0,
                dislike: 0,
                userReaction: null,
            });
        }

        let userReaction = null;

        if (
            reaction.likedBy && reaction.likedBy.some(
                (id) =>
                    id.toString() === userId
            )
        ) {
            userReaction = "like";
        }

        if (
            reaction.dislikedBy && reaction.dislikedBy.some(
                (id) =>
                    id.toString() === userId
            )
        ) {
            userReaction = "dislike";
        }

        return res.json({
            like: reaction.like,
            dislike: reaction.dislike,
            userReaction,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
        });
    }
};

module.exports = { toggleSystemReaction, getSystemReaction };