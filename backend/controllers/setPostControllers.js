const fs = require('fs');
const path = require('path');

const getAllPosts = (req, res) => {
  const dirPath = path.join(__dirname, '../setpostjson');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }

    const allPosts = [];

    files.forEach((file) => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(dirPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        try {
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

module.exports = { getAllPosts };
