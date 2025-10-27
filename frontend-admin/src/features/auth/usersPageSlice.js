import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: 10,
  activeUsers: 6,
  BlockedUsers: 2,
  flaggedPosts: 3,
  userList: [
    {
      id: "u001",
      username: "JohnDoe",
      email: "john@example.com",
      totalPosts: 4,
      totalLikes: 25,
      publicPosts: 3,
      privatePosts: 1,
      isActive: true,
      registeredAt: "2024-01-10T12:00:00Z",
      basic_info: {
        bio: "Love coding and blogging.",
        profession: "Software Engineer",
        location: "New York",
      },
      professional: {
        education: "B.Tech in CS",
        keySkills: "React, Node.js, MongoDB",
      },
      contact: {
        phone: "+1234567890",
      },
      posts: [
        {
          id: "p5",
          title: "Best Food Spots in Italy",
          likes: 12,
          dislikes: 3,
          reports: 0,
          visibility: "public",
          tags: ["food", "italy"],
          createdAt: "2025-09-20T14:00:00Z",
        },
        {
          id: "p6",
          title: "Traveling Solo",
          likes: 5,
          dislikes: 1,
          reports: 1,
          visibility: "private",
          tags: ["travel"],
          createdAt: "2025-09-22T18:30:00Z",
        },
        {
          id: "p7",
          title: "Photography Tips",
          likes: 1,
          dislikes: 0,
          reports: 0,
          visibility: "public",
          tags: ["photography"],
          createdAt: "2025-09-15T11:00:00Z",
        },

      ],

    },
    {
      id: "u002",
      username: "JaneSmith",
      email: "jane@example.com",
      totalPosts: 3,
      totalLikes: 18,
      publicPosts: 2,
      privatePosts: 1,
      isActive: false,
      registeredAt: "2024-02-05T15:30:00Z",
      basic_info: {
        bio: "Travel blogger and foodie.",
        profession: "Content Creator",
        location: "London",
      },
      professional: {
        education: "MBA in Marketing",
        keySkills: "SEO, Blogging, Social Media",
      },
      contact: {
        phone: "+9876543210",
      },
      posts: [
        {
          id: "p5",
          title: "Best Food Spots in Italy",
          likes: 12,
          dislikes: 3,
          reports: 0,
          visibility: "public",
          tags: ["food", "italy"],
          createdAt: "2025-09-20T14:00:00Z",
        },
        {
          id: "p6",
          title: "Traveling Solo",
          likes: 5,
          dislikes: 1,
          reports: 1,
          visibility: "private",
          tags: ["travel"],
          createdAt: "2025-09-22T18:30:00Z",
        },
        {
          id: "p7",
          title: "Photography Tips",
          likes: 1,
          dislikes: 0,
          reports: 0,
          visibility: "public",
          tags: ["photography"],
          createdAt: "2025-09-15T11:00:00Z",
        },

      ],
    },
  ],
};

const usersPageSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    deletePost: (state, action) => {
      const { userId, postId } = action.payload;
      const user = state.userList.find((u) => u.id === userId);
      if (user) {
        user.posts = user.posts.filter((post) => post.id !== postId);
        user.totalPosts = user.posts.length;
        user.totalLikes = user.posts.reduce((acc, p) => acc + p.likes, 0);
      }
    },
  },
});

export const selectAllPosts = (state) => {
  return state.users.userList.flatMap((user) =>
    (user.posts || []).map((post) => ({
      ...post,
      userId: user.id,
      username: user.username,
      visibility: post.visibility || "public", // safe default
      createdAt: post.createdAt || "2024-09-20T10:00:00Z", // safe default
    }))
  );
};



export const { deletePost } = usersPageSlice.actions;
export default usersPageSlice.reducer;
