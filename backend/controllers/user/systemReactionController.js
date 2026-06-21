const SystemPostReaction = require(
    "../../models/user/SystemPostReaction"
);

const toggleSystemReaction = async (req, res) => {
    try {
        const { systemPostId } = req.params;
        const { reaction } = req.body;

        const userId = req.userId;

        if (!["like", "dislike"].includes(reaction)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reaction",
            });
        }

        let postReaction =
            await SystemPostReaction.findOne({
                systemPostId,
            });

        if (!postReaction) {
            postReaction =
                await SystemPostReaction.create({
                    systemPostId,
                });
        }

        const userLiked =
            postReaction.likedBy.some(
                (id) => id.toString() === userId
            );

        const userDisliked =
            postReaction.dislikedBy.some(
                (id) => id.toString() === userId
            );

        if (reaction === "like") {
            if (userLiked) {
                postReaction.likedBy.pull(userId);
            } else {
                postReaction.likedBy.addToSet(userId);

                if (userDisliked) {
                    postReaction.dislikedBy.pull(userId);
                }
            }
        }

        if (reaction === "dislike") {
            if (userDisliked) {
                postReaction.dislikedBy.pull(userId);
            } else {
                postReaction.dislikedBy.addToSet(userId);

                if (userLiked) {
                    postReaction.likedBy.pull(userId);
                }
            }
        }

        postReaction.like =
            postReaction.likedBy.length;

        postReaction.dislike =
            postReaction.dislikedBy.length;

        await postReaction.save();

        let userReaction = null;

        if (
            postReaction.likedBy.some(
                (id) => id.toString() === userId
            )
        ) {
            userReaction = "like";
        }

        if (
            postReaction.dislikedBy.some(
                (id) => id.toString() === userId
            )
        ) {
            userReaction = "dislike";
        }

        return res.json({
            success: true,
            like: postReaction.like,
            dislike: postReaction.dislike,
            userReaction,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to react",
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
            reaction.likedBy.some(
                (id) => id.toString() === userId
            )
        ) {
            userReaction = "like";
        }

        if (
            reaction.dislikedBy.some(
                (id) => id.toString() === userId
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
        return res.status(500).json({
            success: false,
        });
    }
};

module.exports = { toggleSystemReaction, getSystemReaction };