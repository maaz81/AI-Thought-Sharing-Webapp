// const Post = require('../models/Post');

// const getPosts = async (req, res)=>{
//     try{
//         const posts = await Post.find();
//         if(!posts || posts.length === 0) {
//             return res.status(404).json({message: 'Posts not avaiable'});
//         }
//         res.status(200).json(posts);
//     }
//     catch(err){
//         res.status(500).json({error: err.message});
//     }
// }

// const createPosts = async (req,res) =>{
//     try {
//         const { title, content, tags, userid } = req.body; 
//         const post = await Post.create({
//             title,
//             content,
//             tags,
//             userid
//         })
//         res.status(200).json(post);
//     } catch(err){
//         res.status(500).json({error: err.message});
//     }
// }


// module.exports = { getPosts, createPosts};


const Post = require('../models/Post');
const User = require('../models/User');
const PostDetails = require('../models/PostDetails');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'Posts not available' });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPosts = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, content, tags } = req.body;

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
      status: 'public'
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



module.exports = { getPosts, createPosts, searchBar };
