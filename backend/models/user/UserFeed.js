const mongoose = require("mongoose");

const userFeedSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },

  /* =========================
     SOCIAL GRAPH
  ========================== */

  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  mutedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  /* =========================
     CONTENT SIGNALS
  ========================== */

  likedPosts: [{
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    likedAt: {
      type: Date,
      default: Date.now,
    },
    tags: [String], // snapshot for fast interest calc
  }],

  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],

  /* =========================
     INTEREST ENGINE
  ========================== */

  interestTags: [{
    tag: String,
    score: {
      type: Number, // weight
      default: 1,
    },
    source: {
      type: String,
      enum: ["like", "post", "follow", "profile"],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  }],

  /* =========================
     FEED CACHING
  ========================== */

  feedQueue: [{
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    score: Number, // algorithm score
    reason: {
      type: String, // "following", "interest", "trending"
    },
    addedAt: {
      type: Date,
      default: Date.now,
    }
  }],

  lastFeedRefresh: {
    type: Date,
  },

}, {
  timestamps: true
});

module.exports = mongoose.model("UserFeed", userFeedSchema);
