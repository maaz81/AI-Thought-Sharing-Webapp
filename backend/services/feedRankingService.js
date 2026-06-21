const calculateFeedScore = ({
    post,
    userFeed,
    source = "user",
}) => {

    let score = 0;

    /*
     * Interest Match
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
                score += match.score * 5;
            }

        });

    }

    /*
     * Engagement
     */

    score += (post.likes || 0) * 3;

    score += (post.dislikes || 0) * -1;

    /*
     * Recency
     */

    const ageHours =
        (Date.now() -
            new Date(post.createdAt).getTime()) /
        (1000 * 60 * 60);

    if (ageHours < 24) {
        score += 20;
    }

    if (ageHours < 72) {
        score += 10;
    }

    return score;
};

const calculateFollowBonus = (
    postAuthorId,
    userFeed
) => {

    if (!postAuthorId) return 0;

    const follows =
        userFeed?.following?.some(
            id =>
                id.toString() ===
                postAuthorId.toString()
        );

    return follows ? 50 : 0;
};

module.exports = {
    calculateFeedScore,
    calculateFollowBonus,
};