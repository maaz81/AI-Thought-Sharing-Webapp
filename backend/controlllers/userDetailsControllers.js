const UserDetails = require('../models/UserDetails');
const User = require('../models/User');

const createUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    // req.body is now parsed by multer
    const {
      name,
      age,
      gender,
      bio,
      location
    } = req.body;

    const photoFilename = req.file ? req.file.filename : null;

    const userDetails = await UserDetails.findOneAndUpdate(
      { userid: userId },
      {
        $set: {
          basic_info: {
            username: name,
            age,
            gender,
            bio,
            location,
            photo: photoFilename || 'default.jpg'
          }
        }
      },
      { new: true, upsert: true }
    );

    const user = await User.findById(userId);
    if (user) {
      user.username = name;
      await user.save();
    }


    res.status(201).json({
      message: 'User details saved successfully',
      userDetails
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save user details', error: err.message });
  }
};

module.exports = { createUserDetails };
