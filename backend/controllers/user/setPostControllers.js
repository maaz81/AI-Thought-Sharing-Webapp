const fs = require('fs');
const path = require('path');

const getAllPosts = (req, res) => {
  const dirPath = path.join(__dirname, '../../setpostjson');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }

    const allPosts = [];

    files.forEach((file) => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(dirPath, file);
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          const parsedData = JSON.parse(data);
          allPosts.push(...parsedData); // Flatten all arrays
        } catch (parseErr) {
          console.error(`Error parsing ${file}:`, parseErr.message);
        }
      }
    });

    res.json(allPosts);
  });
};

const getSpecificPost = (req, res) => {
  const postId = req.params.postId;

  if (!postId || postId === 'undefined') {
    return res.status(400).json({ error: 'Post ID is required and must be valid.' });
  }

  const dirPath = path.join(__dirname, '../setpostjson');
  let allPosts = [];

  try {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(dirPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        allPosts.push(...parsedData);
      }
    });

    const postDetails = allPosts.find(post => post._id === postId);

    if (!postDetails) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(postDetails);

  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllPosts, getSpecificPost };
