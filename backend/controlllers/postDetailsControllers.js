const { json } = require('express');
const PostDetails = require('../models/PostDetails');
const Post = require('../models/Post');


const postLikeDetails = async (req, res) => {
  try {
    const { reaction } = req.body; // "like" or "dislike"
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const postId = req.params.id;

    if (!['like', 'dislike'].includes(reaction)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    // Find the PostDetails document
    const postDetails = await PostDetails.findOne({ postid: postId });
    if (!postDetails) {
      return res.status(404).json({ error: 'PostDetails not found' });
    }

    if (reaction === 'like') {
      postDetails.like = (parseInt(postDetails.like) || 0) + 1;
    } else {
      postDetails.dislike = (parseInt(postDetails.dislike) || 0) + 1;
    }

    await postDetails.save();



    res.status(200).json({ message: 'Reaction recorded', postDetails });
  } catch (err) {
    console.error('React error:', err);
    res.status(500).json({ error: err.message });
  }
};


const getLikeDetails = async (req, res) => {
  try {
    const id = req.userId;
    const likeDetials = await PostDetails.find({ userid: id })
    res.status(200).json({ message: `user ${id}`, post: `post ${likeDetials}` });
  } catch (error) {
    res.json({ error: error.message })
  }
}

const postUpdateDetails = async (req, res) => {
  const { title, content, tags } = req.body;

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

module.exports = { postLikeDetails, getLikeDetails, postUpdateDetails, getUpdateDetails, deletePostDetails };