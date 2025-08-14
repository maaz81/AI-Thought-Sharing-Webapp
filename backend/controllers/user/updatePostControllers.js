const { json } = require('express');
const PostDetails = require('../../models/user/PostDetails');
const Post = require('../../models/user/Post');

const postUpdateDetails = async (req, res) => {
  const { title, content, tags, visibility } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    const updatedPost = await post.save();

    const postDetails = await PostDetails.findOne({ postid: post._id});
    postDetails.update = Date.now();
    postDetails.visibility = visibility;
    await postDetails.save();

    const io = req.app.get('io');
    io.emit('postUpdated', updatedPost);

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

const getUpdateDetails = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

const deletePostDetails = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        const deletedDetails = await PostDetails.findOneAndDelete({ postid: req.params.id });
        if (!deleted) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const io = req.app.get('io');
        io.emit('postDeleted', req.params.id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = { postUpdateDetails, getUpdateDetails, deletePostDetails };