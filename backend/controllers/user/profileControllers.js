const User = require('../../models/user/User');
const Post = require('../../models/user/Post');
const PostDetails = require('../../models/user/PostDetails');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserPost = async (req, res) => {
  try {
    const userPosts = await Post.find({ userid: req.userId });
    res.json(userPosts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userPosts = await Post.find({ userid: req.userId });
    res.json({
      posts: userPosts.length,
    })

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate('userDetails');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Find all posts belonging to this user
    const posts = await Post.find({ userid: user._id }).select('_id');
    const postIds = posts.map(p => p._id);

    // 2. Fetch PostDetails for these posts, filtering by public visibility
    const rawPosts = await PostDetails.find({
      postid: { $in: postIds },
      visibility: 'public'
    })
      .populate({
        path: 'postid',
        select: 'title content tags'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Flatten the structure for the frontend
    const userPosts = rawPosts.map(pd => ({
      _id: pd._id, // PostDetails ID
      postId: pd.postid?._id, // Actual Post ID
      title: pd.postid?.title,
      content: pd.postid?.content,
      tags: pd.postid?.tags,
      createdAt: pd.createdAt,
      likes: pd.like || 0,
      dislikes: pd.dislike || 0,
      visibility: pd.visibility
    })).filter(post => post.title); // Filter out any broken links

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        userDetails: user.userDetails, // Contains photo
        createdAt: user.createdAt
      },
      posts: userPosts,
      postCount: userPosts.length
    });

  } catch (error) {
    console.error("Get Public Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getUserProfile, getUserPost, getUserStats, getPublicProfile };
