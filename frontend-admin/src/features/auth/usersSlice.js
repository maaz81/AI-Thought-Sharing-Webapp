// UsersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: 12340,
  activeUsers: 1245,
  BlockedUsers: 894,
  flaggedPosts: 32,
  aiUsage: { suggestions: 320, chatbot: 110 },
  userList: [  // New field
    {
      id: "u001",
      username: "john_doe",
      totalPosts: 120,
      totalLikes: 540,
      isActive: true,
      isBlocked: false,
      registeredAt: "2023-08-01T10:00:00Z",
    },
    {
      id: "u002",
      username: "jane_smith",
      totalPosts: 98,
      totalLikes: 230,
      isActive: false,
      isBlocked: false,
      registeredAt: "2023-08-01T10:00:00Z",
    },
    {
      id: "u003",
      username: "blocked_user",
      totalPosts: 87,
      totalLikes: 120,
      isActive: false,
      isBlocked: true,
      registeredAt: "2023-08-01T10:00:00Z",
    },
    {
      id: "u001",
      username: "john_doe",
      totalPosts: 120,
      totalLikes: 540,
      isActive: true,
      isBlocked: false,
      registeredAt: "2023-08-01T10:00:00Z",
    },
    {
      id: "u002",
      username: "jane_smith",
      totalPosts: 98,
      totalLikes: 230,
      isActive: false,
      isBlocked: false,
      registeredAt: "2023-08-01T10:00:00Z",
    },
    {
      id: "u003",
      username: "blocked_user",
      totalPosts: 87,
      totalLikes: 120,
      isActive: false,
      isBlocked: true,
      registeredAt: "2023-08-01T10:00:00Z",
    },
    // ...more mock users
  ],
};

const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export default UsersSlice.reducer;
