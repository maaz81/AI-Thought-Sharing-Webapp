const Post = require('../../models/user/Post');
const User = require('../../models/user/User');
const PostDetails = require('../../models/user/PostDetails')
const SystemPostReaction = require("../../models/user/SystemPostReaction");
const UserFeed = require(
  "../../models/user/UserFeed"
);

const {
  calculateFeedScore,
  calculateFollowBonus,
} = require(
  "../../services/feedRankingService"
);
const { generateAutoTags } = require("../../utils/autoTagService");
const { updateUserInterests } = require("../../services/interestService");
const { sendSuccess, sendError, sendPaginated } = require("../../utils/apiResponse");
const path = require("path");
const fs = require("fs");

/* ================================================================
   JSON SYSTEM POSTS — Module-level in-memory cache
   Avoids synchronous disk reads (readdirSync / readFileSync) on
   every single feed request. Cache auto-refreshes every 5 minutes.
================================================================ */
let _jsonPostsCache = null;
let _jsonPostsCacheTime = 0;
const JSON_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getSystemPosts = () => {
  const now = Date.now();
  if (_jsonPostsCache && now - _jsonPostsCacheTime < JSON_CACHE_TTL_MS) {
    return _jsonPostsCache;
  }
  const dirPath = path.join(__dirname, "../../setpostjson");
  const posts = [];
  fs.readdirSync(dirPath).forEach((file) => {
    if (path.extname(file) === ".json") {
      const filePosts = JSON.parse(fs.readFileSync(path.join(dirPath, file), "utf8"));
      // Normalize tags to lowercase for consistency with user posts
      filePosts.forEach(p => {
        if (Array.isArray(p.tags)) {
          p.tags = p.tags.map(t => typeof t === "string" ? t.trim().toLowerCase() : t).filter(Boolean);
        }
      });
      posts.push(...filePosts);
    }
  });
  _jsonPostsCache = posts;
  _jsonPostsCacheTime = now;
  console.log(`[SystemPosts] Cache refreshed — ${posts.length} posts loaded`);
  return posts;
};

/**
 * Get all public posts with pagination
 * Query params: ?page=1&limit=10
 */
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalItems = await PostDetails.countDocuments({ visibility: 'public' });

    const posts = await PostDetails.find({ visibility: 'public' })
      .populate({
        path: 'postid',
        select: '_id title content tags'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!posts || posts.length === 0) {
      return sendSuccess(res, 200, [], 'No posts available');
    }

    // Flatten structure
    const flatPosts = posts
      .map(p => ({
        _id: p._id,
        postId: p.postid?._id || null,
        title: p.postid?.title,
        content: p.postid?.content,
        tags: p.postid?.tags,
        visibility: p.visibility,
        likes: p.like || 0,
        dislikes: p.dislike || 0,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
      .filter(p =>
        p.title &&
        p.content &&
        Array.isArray(p.tags) &&
        p.tags.length > 0
      );

    const totalPages = Math.ceil(totalItems / limit);

    return sendPaginated(res, flatPosts, {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }, 'Posts retrieved successfully');

  } catch (err) {
    console.error('Get Posts Error:', err);
    return sendError(res, 500, 'Failed to retrieve posts');
  }
};

/**
 * Get a specific post by ID
 */
const getSpecificPost = async (req, res) => {
  const postId = req.params.postId;

  // Check if postId is valid
  if (!postId || postId === 'undefined') {
    return sendError(res, 400, 'Post ID is required and must be valid');
  }

  try {
    const postDetails = await Post.findById(postId);
    if (!postDetails) {
      return sendError(res, 404, 'Post not found');
    }

    return sendSuccess(res, 200, postDetails, 'Post retrieved successfully');
  } catch (error) {
    console.error('Error fetching post:', error.message);
    return sendError(res, 500, 'Server error while fetching post');
  }
};

/**
 * Create a new post
 */
const createPosts = async (req, res) => {
  try {
    // Authentication check
    if (!req.userId) {
      return sendError(res, 401, 'User not authenticated');
    }

    const { title, content, tags = [], visibility = "public" } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return sendError(res, 400, 'Title is required');
    }

    if (!content || !content.trim()) {
      return sendError(res, 400, 'Content is required');
    }

    // Normalize tags
    let userTags = Array.isArray(tags) ? tags : [];
    userTags = userTags
      .map((t) => t.toString().trim().toLowerCase())
      .filter(Boolean);

    if (userTags.length === 0) {
      return sendError(res, 400, 'At least one tag is required');
    }

    // Auto-tag system
    let finalTags = [...userTags];
    let autoTags = [];

    if (userTags.length < 3) {
      try {
        autoTags = await generateAutoTags({
          title,
          content,
          existingTags: userTags,
        });

        const tagSet = new Set([...userTags, ...autoTags]);
        finalTags = Array.from(tagSet);
      } catch (err) {
        console.error("Auto-tagging failed:", err.message);
        finalTags = userTags; // fallback
      }
    }

    // Create post
    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      tags: finalTags,
      userid: req.userId,
      aiMeta: {
        autoTagged: autoTags.length > 0,
        autoTagsUsed: autoTags,
      }
    });

    // Create post details
    const postDetails = await PostDetails.create({
      postid: post._id,
      userid: req.userId,
      like: 0,
      dislike: 0,
      visibility,
    });

    // Link post ↔ postDetails
    await Post.findByIdAndUpdate(
      post._id,
      { $set: { postdetailsid: postDetails._id } },
      { new: true }
    );

    // Add post to user
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { posts: post._id } },
      { new: true }
    );

    // Socket.IO emit
    const io = req.app.get("io");
    if (io) {
      io.emit("postCreated", {
        _id: post._id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        visibility,
      });
    }

    /*
     * Problem #3 Fix — Learn from post creation.
     * When a user writes about a topic, that's a strong signal of interest.
     * Fire-and-forget (non-blocking) so the response is not delayed.
     */
    updateUserInterests(req.userId, finalTags, "post")
      .catch((err) =>
        console.error("[InterestService] Post-creation update failed:", err.message)
      );

    return sendSuccess(res, 201, { post, postDetails }, 'Post created successfully');

  } catch (err) {
    console.error("Create Post Error:", err.message);
    return sendError(res, 500, 'Failed to create post');
  }
};

/**
 * Search posts and users with pagination
 * Query params: ?query=term&page=1&limit=10
 */
const searchBar = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query || !query.trim()) {
      return sendError(res, 400, 'Search query is required');
    }

    const regex = new RegExp(query.trim(), 'i');

    // Get counts for pagination
    const [postCount, userCount] = await Promise.all([
      Post.countDocuments({
        $or: [
          { title: regex },
          { content: regex },
          { tags: regex },
        ],
      }),
      User.countDocuments({
        $or: [
          { name: regex },
          { username: regex },
        ],
      })
    ]);

    // Fetch paginated results
    const [postResults, userResults] = await Promise.all([
      Post.find({
        $or: [
          { title: regex },
          { content: regex },
          { tags: regex },
        ],
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      User.find({
        $or: [
          { name: regex },
          { username: regex },
        ],
      })
        .select('name username email userDetails')
        .populate({
          path: 'userDetails',
          select: 'basic_info.photo'
        })
        .skip(skip)
        .limit(limit)
    ]);

    const totalItems = postCount + userCount;
    const totalPages = Math.ceil(Math.max(postCount, userCount) / limit);

    return sendPaginated(res,
      { posts: postResults, users: userResults },
      {
        currentPage: page,
        totalPages,
        totalPosts: postCount,
        totalUsers: userCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      'Search completed successfully'
    );

  } catch (err) {
    console.error('Search error:', err);
    return sendError(res, 500, 'Search failed');
  }
};


const getHomeFeed = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    /*
     * Problem #1 Fix — Score ALL candidates before paginating.
     *
     * OLD (broken) flow:
     *   Grab newest 10 Mongo posts + first 10 JSON posts
     *   → score those 20 → sort → return
     *
     *   Problem: a highly-relevant post at JSON position #200 was
     *   never scored. Every user saw almost the same feed.
     *
     * NEW flow:
     *   Grab up to MONGO_CANDIDATE_LIMIT user posts + ALL system posts
     *   → score every candidate → sort globally → slice the page
     *
     *   Now a user with Exams=70 will see the matching Exams post on
     *   page 1 regardless of where it sits in the raw data.
     */
    const PAGE_SIZE = 20;
    const MONGO_CANDIDATE_LIMIT = 200; // enough candidates for good ranking

    // Load the requesting user's interest profile
    const userFeed = await UserFeed.findOne({ userId: req.userId });

    /* =========================
       USER POSTS — large candidate pool
    ========================== */

    const mongoPosts = await PostDetails.find({ visibility: "public" })
      .populate({
        path: "postid",
        select: "_id title content tags userid",
      })
      .sort({ createdAt: -1 })
      .limit(MONGO_CANDIDATE_LIMIT) // pull enough to rank meaningfully
      .lean();

    const formattedMongoPosts = mongoPosts
      .filter((p) => p.postid)
      .map((p) => {
        const post = {
          source: "user",
          _id: p.postid._id,
          authorId: p.postid.userid,
          title: p.postid.title,
          content: p.postid.content,
          tags: p.postid.tags || [],
          likes: p.like || 0,
          dislikes: p.dislike || 0,
          createdAt: p.createdAt,
        };

        const score =
          calculateFeedScore({ post, userFeed }) +
          calculateFollowBonus(post.authorId, userFeed);

        return { ...post, score };
      });

    /* =========================
       SYSTEM POSTS — load ALL, score ALL
       (uses module-level cache — no disk read per request)
    ========================== */

    const allJsonPosts = getSystemPosts();

    // Single DB round-trip to get reactions for all system posts
    const reactions = await SystemPostReaction.find({
      systemPostId: { $in: allJsonPosts.map((p) => p._id) },
    });

    const reactionMap = {};
    reactions.forEach((r) => {
      reactionMap[r.systemPostId] = r;
    });

    const systemPosts = allJsonPosts.map((post) => {
      const likes = reactionMap[post._id]?.like || 0;
      const dislikes = reactionMap[post._id]?.dislike || 0;

      const systemPost = { source: "system", ...post, likes, dislikes };

      const score = calculateFeedScore({
        post: systemPost,
        userFeed,
        source: "system",
      });

      return { ...systemPost, score };
    });

    /* =========================
       MERGE + RANK ALL CANDIDATES
       Sort happens AFTER scoring every candidate, not before.
    ========================== */

    const allCandidates = [...formattedMongoPosts, ...systemPosts];
    allCandidates.sort((a, b) => b.score - a.score);

    /* =========================
       PAGINATE AFTER RANKING
    ========================== */

    const totalItems = allCandidates.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const feed = allCandidates.slice(start, end);

    return res.status(200).json({
      success: true,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      count: feed.length,
      data: feed,
    });

  } catch (error) {
    console.error("Feed Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load feed",
    });
  }
};


module.exports = { getPosts, getSpecificPost, createPosts, searchBar, getHomeFeed };

