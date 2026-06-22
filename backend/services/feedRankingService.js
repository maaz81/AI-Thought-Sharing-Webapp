const calculateFeedScore = ({
    post,
    userFeed,
    source = "user",
}) => {

    let score = 0;

    /*
     * Interest Match
     * Each matching tag contributes its learned weight × 2.
     * A user with Exams=70 viewing an Exams post gets +140 from this alone.
     */

    const postTags = post.tags || [];

    if (userFeed?.interestTags?.length) {

        postTags.forEach(tag => {

            const match =
                userFeed.interestTags.find(
                    t =>
                        t.tag.toLowerCase() ===
                        tag.toLowerCase()
                );

            if (match) {
                score += match.score * 3;
            }

        });

    }

    /*
     * Engagement
     * Likes are a strong positive signal; dislikes are a mild penalty.
     */

    score += (post.likes || 0) * 3;
    score += (post.dislikes || 0) * -1;

    /*
     * Recency — mutually exclusive tiers.
     * < 24h  → +20
     * 24-72h → +10
     * > 72h  → +0
     *
     * Fixed: was double-adding (+30) for posts under 24h because
     * both `if` blocks fired. Now uses `else if` so each post
     * lands in exactly one tier.
     */

    const ageHours =
        (Date.now() -
            new Date(post.createdAt).getTime()) /
        (1000 * 60 * 60);

    if (ageHours < 24) {
        score += 20;
    } else if (ageHours < 72) {
        score += 10;
    }

    return score;
};

const calculateFollowBonus = (
    postAuthorId,
    userFeed
) => {

    if (!postAuthorId) return 0;

    /*
     * Follow bonus: +30 for posts from followed creators.
     * Reduced from +50 so high-interest posts from non-followed
     * creators can still surface above low-quality followed content.
     */

    const follows =
        userFeed?.following?.some(
            id =>
                id.toString() ===
                postAuthorId.toString()
        );

    return follows ? 30 : 0;
};

module.exports = {
    calculateFeedScore,
    calculateFollowBonus,
};