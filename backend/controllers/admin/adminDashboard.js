const User = require('../../models/user/User');
const Post = require('../../models/user/Post');
// const Report = require('../models/Report'); // if you have a report model


const dashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    // const pendingPosts = await Post.countDocuments({ status: 'pending' });
    // const reportedPosts = await Report.countDocuments(); // optional

    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalUsers,
      totalPosts,
    //   pendingPosts,
    //   reportedPosts,
    //   recentPosts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports ={dashboard};
