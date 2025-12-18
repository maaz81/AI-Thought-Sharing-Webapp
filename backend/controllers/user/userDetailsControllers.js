const UserDetails = require('../../models/user/UserDetails');
const User = require('../../models/user/User');

const createUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contact = JSON.parse(req.body.contact || '{}');
    const socialLinks = JSON.parse(req.body.socialLinks || '{}');

    // req.body is now parsed by multer
    const {
      name,
      age,
      gender,
      profession,
      bio,
      location,
      education,
      keySkills,
      interests
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Full Name is required' });
    }

    const photoFilename = req.file ? req.file.filename : null;

    // Construct update object using dot notation to preserve other fields (like username)
    const updateFields = {
      'basic_info.name': name,
      'basic_info.age': age,
      'basic_info.gender': gender,
      'basic_info.profession': profession,
      'basic_info.bio': bio,
      'basic_info.location': location,
      'professional.education': education,
      'professional.keySkills': keySkills,
      'professional.interests': interests,
      'contact': contact,
      'socialLinks': socialLinks
    };

    // Only update photo if a new one was uploaded
    if (photoFilename) {
      updateFields['basic_info.photo'] = photoFilename;
    }

    const userDetails = await UserDetails.findOneAndUpdate(
      { userid: userId },
      { $set: updateFields },
      { new: true, upsert: true } // upsert will create if not exists
    );

    // Update the User's display name (not username which is the unique identifier)
    const user = await User.findById(userId);
    if (user) {
      if (user.name !== name) {
        user.name = name;
        await user.save();
      }
    }

    res.status(201).json({
      message: 'User details saved successfully',
      userDetails
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error', error: err.message });
    }
    res.status(500).json({ message: 'Failed to save user details', error: err.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDetails = await UserDetails.findOne({ userid: userId });
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    res.status(200).json(userDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve user details', error: err.message });
  }
}

const getUserPhoto = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDetails = await UserDetails.findOne({ userid: userId });
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    const photo = userDetails.basic_info.photo;
    res.status(200).json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve user details', error: err.message });
  }
}

const getUserBio = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userDetails = await UserDetails.findOne({ userid: userId });
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    const bio = userDetails.basic_info.bio;
    res.status(200).json(bio);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve user bio', error: err.message });
  }
}

module.exports = { createUserDetails, getUserDetails, getUserPhoto, getUserBio };
