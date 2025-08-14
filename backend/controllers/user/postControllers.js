const Post = require('../../models/user/Post');
const User = require('../../models/user/User');
const PostDetails = require('../../models/user/PostDetails')

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
    const flatPosts = posts.map(p => ({
      _id: p._id,
      postId: p.postid?._id || null,
      title: p.postid?.title || "",
      content: p.postid?.content || "",
      tags: p.postid?.tags || [],
      visibility: p.visibility,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

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
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, content, tags, visibility } = req.body;

    const post = await Post.create({
      title,
      content,
      tags,
      userid: req.userId // Use the userId from the authenticated request
    });

    const postDetails = await PostDetails.create({
      postid: post._id,
      userid: req.userId,
      like: '0',
      dislike: '0',
      visibility
    });

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { posts: post._id } },
      { new: true }
    );

    await Post.findByIdAndUpdate(
      post._id,
      { $set: { postdetailsid: postDetails._id } },
      { new: true }
    );

    // Emit real-time event after creating a post
    const io = req.app.get('io');
    io.emit('postCreated', post);



    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchBar = async (req, res) => {
  const { query } = req.query;

  try {
    const regex = new RegExp(query, 'i'); // case-insensitive
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const results = await Post.find({
      $or: [
        { title: { $regex: regex } },
        { tags: { $regex: regex } }
      ]
    });

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = { getPosts, getSpecificPost, createPosts, searchBar };
