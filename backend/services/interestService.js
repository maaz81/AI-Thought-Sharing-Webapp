const UserFeed = require(
    "../models/user/UserFeed"
);

const updateUserInterests = async (
    userId,
    tags,
    source = "like"
) => {
    if (!tags?.length) return;

    let feed =
        await UserFeed.findOne({
            userId,
        });

    if (!feed) {
        feed = await UserFeed.create({
            userId,
        });
    }

    for (const tag of tags) {
        const existing =
            feed.interestTags.find(
                (t) => t.tag === tag
            );

        if (existing) {
            existing.score += 5;
            existing.updatedAt =
                new Date();
        } else {
            feed.interestTags.push({
                tag,
                score: 5,
                source,
            });
        }
    }

    await feed.save();
};

module.exports = {
    updateUserInterests,
};