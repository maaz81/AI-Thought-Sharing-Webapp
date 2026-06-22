const UserFeed = require(
    "../models/user/UserFeed"
);

const decayInterests = async () => {
    try {

        const feeds =
            await UserFeed.find();

        for (const feed of feeds) {

            feed.interestTags =
                feed.interestTags
                    .map((tag) => {

                        const daysSinceUpdate =
                            (Date.now() -
                                new Date(
                                    tag.updatedAt
                                ).getTime()) /
                            (1000 * 60 * 60 * 24);

                        let score =
                            tag.score;

                        /*
                         * Decay only after 7 days
                         */

                        if (
                            daysSinceUpdate > 7
                        ) {
                            score -= 1;
                        }

                        return {
                            ...tag.toObject(),
                            score: Math.max(
                                score,
                                0
                            ),
                        };
                    })
                    .filter(
                        (tag) =>
                            tag.score > 0
                    );

            await feed.save();
        }

        console.log(
            "Interest decay completed"
        );

    } catch (error) {
        console.error(
            "Interest Decay Error:",
            error
        );
    }
};

module.exports = {
    decayInterests,
};