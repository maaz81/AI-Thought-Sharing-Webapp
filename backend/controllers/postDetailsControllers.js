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



module.exports = { postLikeDetails, getLikeDetails };