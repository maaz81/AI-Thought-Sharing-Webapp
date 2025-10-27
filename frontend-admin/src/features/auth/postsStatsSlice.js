// features/posts/postsSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Dummy data for post stats
const initialStats = {
  total: 12,
  publicPosts: 8,
  privatePosts: 4,
  totalLikes: 123,
  totalDislikes: 17,
  lastDay: 2,
  last7Days: 5,
  lastMonth: 10,
  tags: {
    JavaScript: 3,
    React: 4,
    CSS: 2,
    Node: 2,
    "UI/UX": 1,
  },
};

// Dummy data for posts table
const initialPosts = [
  {
    id: "p001",
    title: "Understanding React Hooks",
    username: "john_doe",
    visibility: "public",
    likes: 34,
    dislikes: 2,
    createdAt: "2025-10-04T10:00:00Z",
  },
  {
    id: "p002",
    title: "Node.js vs Deno",
    username: "alice_dev",
    visibility: "private",
    likes: 18,
    dislikes: 1,
    createdAt: "2025-10-03T15:30:00Z",
  },
  {
    id: "p003",
    title: "CSS Grid vs Flexbox",
    username: "mike_css",
    visibility: "public",
    likes: 25,
    dislikes: 4,
    createdAt: "2025-10-01T08:45:00Z",
  },
  {
    id: "p004",
    title: "Writing Clean Code in JS",
    username: "sara_code",
    visibility: "public",
    likes: 40,
    dislikes: 3,
    createdAt: "2025-09-30T11:20:00Z",
  },
  {
    id: "p005",
    title: "Design Patterns in React",
    username: "john_doe",
    visibility: "private",
    likes: 6,
    dislikes: 1,
    createdAt: "2025-09-28T17:00:00Z",
  },
];

const initialState = {
  stats: initialStats,
  posts: initialPosts,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Add reducers if needed, e.g., deletePost, addPost, etc.
    deletePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
  },
});

// Selectors
export const selectAllPosts = (state) => state.posts.posts;
export const selectPostStats = (state) => state.posts.stats;

export const { deletePost } = postsSlice.actions;

export default postsSlice.reducer;
