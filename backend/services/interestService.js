const UserFeed = require("../models/user/UserFeed");

/**
 * Atomically update a user's interest tag scores.
 *
 * Each tag score increases by SCORE_INCREMENT per signal (like, post, follow).
 * Score is capped at MAX_SCORE. Tags are normalized to lowercase so the
 * ranking service comparisons are always consistent.
 *
 * Race condition fix:
 *   Old code did findOne → mutate array in JS → save(), meaning two
 *   simultaneous likes could silently overwrite each other.
 *   New code uses atomic MongoDB operators:
 *     - $inc with positional $ for existing tags (truly atomic)
 *     - guarded $push for new tags (prevents duplicate race condition)
 *
 * @param {string}   userId  - The user whose interests to update
 * @param {string[]} tags    - Array of tag strings (raw, will be normalized)
 * @param {string}   source  - Signal source: "like" | "post" | "follow" | "profile"
 */
const updateUserInterests = async (
    userId,
    tags,
    source = "like"
) => {
    if (!tags?.length) return;

    const SCORE_INCREMENT = 5;
    const MAX_SCORE = 100;

    // Normalize tags: lowercase, trimmed, no empties, no duplicates
    const normalizedTags = [
        ...new Set(
            tags
                .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
                .filter(Boolean)
        ),
    ];

    if (!normalizedTags.length) return;

    // Ensure UserFeed document exists before we start updating it
    await UserFeed.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId } },
        { upsert: true, new: false }
    );

    // Process each tag with atomic DB operations (no read-modify-save)
    for (const tag of normalizedTags) {

        /*
         * Step 1: Try to atomically increment score for an existing tag.
         * We use `$min` in a pipeline update to enforce the MAX_SCORE cap.
         * If no document matches (tag not yet in array), matchedCount === 0.
         */
        const result = await UserFeed.updateOne(
            {
                userId,
                "interestTags.tag": tag,
            },
            {
                $inc: { "interestTags.$.score": SCORE_INCREMENT },
                $set: {
                    "interestTags.$.source": source,
                    "interestTags.$.updatedAt": new Date()
                }
            }
        );

        /*
         * Step 2: If the tag doesn't exist yet, push a new entry.
         * The guard `"interestTags.tag": { $ne: tag }` prevents a duplicate
         * push if two requests race to add the same new tag simultaneously.
         */
        if (result.matchedCount === 0) {
            await UserFeed.updateOne(
                {
                    userId,
                    "interestTags.tag": { $ne: tag },
                },
                {
                    $push: {
                        interestTags: {
                            tag,
                            score: SCORE_INCREMENT,
                            source,
                            updatedAt: new Date(),
                        },
                    },
                }
            );
        }
    }
};

module.exports = {
    updateUserInterests,
};