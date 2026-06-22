const mongoose = require("mongoose");
const User = require("../../models/user/User");
const UserFeed = require("../../models/user/UserFeed");
const Post = require("../../models/user/Post");
const { updateUserInterests } = require("../../services/interestService");

/* =====================================================
   FOLLOW USER
===================================================== */
exports.followUser = async (req, res) => {
  try {
    const followerId = req.userId;        // logged-in user (from authMiddleware)
    const followingId = req.params.userId; // user to follow

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // check user exists
    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // ensure both UserFeed docs exist
    const [followerFeed, followingFeed] = await Promise.all([
      UserFeed.findOneAndUpdate(
        { userId: followerId },
        { $setOnInsert: { userId: followerId } },
        { upsert: true, new: true }
      ),
      UserFeed.findOneAndUpdate(
        { userId: followingId },
        { $setOnInsert: { userId: followingId } },
        { upsert: true, new: true }
      ),
    ]);

    // already following?
    if (followerFeed.following.includes(followingId)) {
      return res.status(409).json({ message: "Already following this user" });
    }

    // update social graph
    await Promise.all([
      UserFeed.updateOne(
        { userId: followerId },
        { $addToSet: { following: followingId } }
      ),
      UserFeed.updateOne(
        { userId: followingId },
        { $addToSet: { followers: followerId } }
      ),
    ]);

    /*
     * Problem #3 Fix — Learn from follows.
     * Following someone is one of the strongest intent signals.
     * We fetch their 10 most recent posts and extract tags to
     * bootstrap the follower's interest profile for that creator's topics.
     *
     * Fire-and-forget so the follow response is instant.
     */
    setImmediate(async () => {
      try {
        const recentPosts = await Post
          .find({ userid: followingId })
          .select('tags')
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        // Collect all unique tags from the followed user's posts
        const tags = [
          ...new Set(recentPosts.flatMap((p) => p.tags || []))
        ];

        if (tags.length) {
          await updateUserInterests(followerId, tags, 'follow');
          console.log(
            `[InterestService] Follow signal: ${tags.length} tags from @${followingId} → user ${followerId}`
          );
        }
      } catch (err) {
        console.error('[InterestService] Follow interest update failed:', err.message);
      }
    });

    return res.status(200).json({
      message: "User followed successfully",
    });
  } catch (error) {
    console.error("FOLLOW USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   UNFOLLOW USER
===================================================== */
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.userId;        // logged-in user (from authMiddleware)
    const followingId = req.params.userId;

    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const followerFeed = await UserFeed.findOne({ userId: followerId });
    if (!followerFeed) {
      return res.status(404).json({ message: "Follow data not found" });
    }

    // not following?
    if (!followerFeed.following.includes(followingId)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    await Promise.all([
      UserFeed.updateOne(
        { userId: followerId },
        { $pull: { following: followingId } }
      ),
      UserFeed.updateOne(
        { userId: followingId },
        { $pull: { followers: followerId } }
      ),
    ]);

    return res.status(200).json({
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("UNFOLLOW USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET FOLLOWERS
===================================================== */
exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;

    const feed = await UserFeed.findOne({ userId })
      .populate("followers", "username email");

    if (!feed) {
      return res.status(200).json({ followers: [] });
    }

    res.status(200).json({
      count: feed.followers.length,
      followers: feed.followers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET FOLLOWING
===================================================== */
exports.getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;

    const feed = await UserFeed.findOne({ userId })
      .populate("following", "username email");

    if (!feed) {
      return res.status(200).json({ following: [] });
    }

    res.status(200).json({
      count: feed.following.length,
      following: feed.following,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
