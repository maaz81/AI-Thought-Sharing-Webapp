const mongoose = require("mongoose");

const SystemPostReactionSchema = new mongoose.Schema({
    systemPostId: {
        type: String,
        required: true,
        index: true,
    },

    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    like: {
        type: Number,
        default: 0,
    },

    dislike: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "SystemPostReaction",
    SystemPostReactionSchema
);