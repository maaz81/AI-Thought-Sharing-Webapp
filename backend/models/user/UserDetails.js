const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    basic_info: {
        username: {
            type: String,
            unique: true
        },
        name: String,
        age: Number,
        gender: String,
        bio: String,
        profession: String,
        location: String,
        photo: String
    },
    professional: {
        education: String,
        keySkills: String,
        interests: String,
    },
    contact: {
        email: String,
        phone: String,
    },
    socialLinks: {
        linkedin: String,
        github: String,
        twitter: String,
        website: String,
        facebook: String,
        instagram: String,
        youtube: String,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('UserDetails', userDetailsSchema);
