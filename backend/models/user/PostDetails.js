const mongoose = require("mongoose");

const PostDetailsSchema = mongoose.Schema({
    
    // store list of user IDs who liked
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],

    // store list of user IDs who disliked
    dislikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],

    // auto counts – no need to store as string
    like: {
        type: Number,
        default: 0,
    },
    dislike: {
        type: Number,
        default: 0,
    },

    // comment field (fine)
    comment: {
        type: String,
    },

    // visibility
    visibility: {
        type: String,
        enum: ['public','private'],
        default: 'public',
    },

    // last update
    update: {
        type: Date,
        default: null,
    },

    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required: true
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('PostDetails', PostDetailsSchema);
