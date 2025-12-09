const Post = require('../../models/user/Post');
const User = require('../../models/user/User');
const PostDetails = require('../../models/user/PostDetails')
const { generateAutoTags } = require("../../utils/autoTagService");

const getPosts = async (req, res) => {
  try {
    const posts = await PostDetails.find({ visibility: 'public' })
      .populate({
        path: 'postid',
        select: '_id title content tags'
      })
      .lean();

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'Posts not available' });
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
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
      .filter(p =>
        p.title &&
        p.content &&
        Array.isArray(p.tags) &&
        p.tags.length > 0
      );


    res.status(200).json(flatPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSpecificPost = async (req, res) => {
  const postId = req.params.postId;
  console.log('fetching post with postId:', postId);
  // Check if postId is valid
  if (!postId || postId === 'undefined') {
    return res.status(400).json({ error: 'Post ID is required and must be valid.' });
  }

  try {
    const postDetails = await Post.findById(postId); // Use findById if using _id
    if (!postDetails) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(postDetails);
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const createPosts = async (req, res) => {
  try {

    // -----------------------------
    // 1. AUTHENTICATION CHECK
    // -----------------------------
    if (!req.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { title, content, tags = [], visibility = "public" } = req.body;

    // -----------------------------
    // 2. VALIDATION (same as second code)
    // -----------------------------
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    // normalize tags
    let userTags = Array.isArray(tags) ? tags : [];
    userTags = userTags
      .map((t) => t.toString().trim().toLowerCase())
      .filter(Boolean);

    // Required tag condition (from second code)
    if (userTags.length === 0) {
      return res.status(400).json({ error: "At least one tag is required" });
    }

    // -----------------------------
    // 3. AUTO-TAG SYSTEM (from first code)
    // -----------------------------
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

    // -----------------------------
    // 4. CREATE POST (from 2nd controller)
    // -----------------------------
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

    // -----------------------------
    // 5. CREATE POST DETAILS
    // -----------------------------
    const postDetails = await PostDetails.create({
      postid: post._id,
      userid: req.userId,
      like: "0",
      dislike: "0",
      visibility,
    });

    // link post ↔ postDetails
    await Post.findByIdAndUpdate(
      post._id,
      { $set: { postdetailsid: postDetails._id } },
      { new: true }
    );

    // -----------------------------
    // 6. ADD POST TO USER
    // -----------------------------
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { posts: post._id } },
      { new: true }
    );

    // -----------------------------
    // 7. SOCKET.IO EMIT
    // -----------------------------
    const io = req.app.get("io");
    io.emit("postCreated", {
      _id: post._id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      visibility,
    });

    // -----------------------------
    // 8. RESPONSE
    // -----------------------------
    res.status(200).json({
      message: "Post created successfully",
      post,
      postDetails,
    });

  } catch (err) {
    console.error("Create Post Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const searchBar = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res
        .status(400)
        .json({ message: 'Search query is required', results: [] });
    }

    const regex = new RegExp(query.trim(), 'i'); // case-insensitive

    const results = await Post.find({
      $or: [
        { title: regex },
        { content: regex }, // you might want this too
        { tags: regex },    // works if tags is array of strings or string
      ],
    });

    return res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { getPosts, getSpecificPost, createPosts, searchBar };
