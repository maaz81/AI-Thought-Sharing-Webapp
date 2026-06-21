const fs = require('fs');
const path = require('path');

const getAllPosts = (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const dirPath = path.join(__dirname, "../../setpostjson");

    const files = fs.readdirSync(dirPath);

    let allPosts = [];

    files.forEach((file) => {
      if (path.extname(file) === ".json") {
        const filePath = path.join(dirPath, file);

        const data = fs.readFileSync(filePath, "utf8");

        allPosts.push(...JSON.parse(data));
      }
    });

    const totalItems = allPosts.length;

    const paginatedPosts = allPosts.slice(
      (page - 1) * limit,
      page * limit
    );

    return res.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        hasNextPage:
          page < Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSpecificPost = (req, res) => {
  const postId = req.params.postId;

  if (!postId || postId === 'undefined') {
    return res.status(400).json({ error: 'Post ID is required and must be valid.' });
  }

  const dirPath = path.join(__dirname, '../../setpostjson');
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
