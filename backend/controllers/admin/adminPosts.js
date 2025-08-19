const Post = require('../../models/user/Post');
const PostDetails = require('../../models/user/PostDetails');

// GET all posts (optional filter by status)
const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete post
const deletePost = async  (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await PostDetails.findOneAndDelete({postid: req.params.id});
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllPost, deletePost}