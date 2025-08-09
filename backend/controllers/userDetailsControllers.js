const UserDetails = require('../models/UserDetails');
const User = require('../models/User');

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
      return res.status(400).json({ message: 'Username (name) is required' });
    }

    const photoFilename = req.file ? req.file.filename : null;

    const userDetails = await UserDetails.findOneAndUpdate(
      { userid: userId },
      {
        $set: {
          basic_info: {
            username: name,
            age,
            gender,
            profession,
            bio,
            location,
            photo: photoFilename || 'default.jpg'
          },
          professional: {
            education,
            keySkills,
            interests,
          },
          contact,         // ✅ uses parsed JSON
          socialLinks      // ✅ uses parsed JSON
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

const getUserDetails = async (req,res) =>{
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

const getUserPhoto = async (req,res) =>{
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

const getUserBio = async (req,res) =>{
  try {
    const userId = req.userId;
    if (!userId){
      return res.status(404).json({ message: 'User not found' });
    }
    const userDetails = await UserDetails.findOne({ userid: userId });
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    const bio = userDetails.basic_info.bio;
    res.status(200).json(bio);
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve user bio', error: err.message });
  }
}

module.exports = { createUserDetails , getUserDetails,getUserPhoto, getUserBio };
