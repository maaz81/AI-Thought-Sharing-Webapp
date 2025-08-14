const User = require('../../models/user/User');
const Post = require('../../models/user/Post');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      role: user.role
    });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserPost=  async (req, res) => {
    try {
        const userPosts = await Post.find({ userid: req.userId });
        res.json(userPosts);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserStats = async (req, res)=>{
   try {
        const userPosts = await Post.find({ userid: req.userId });
        res.json({
          posts: userPosts.length,
          })
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = { getUserProfile,getUserPost, getUserStats };
