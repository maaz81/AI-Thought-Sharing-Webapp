import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // ─────────────────────────────
  // 🧮 KPI METRICS
  // ─────────────────────────────
  totalUsers: 12340,
  totalThoughts: 45672,
  flaggedPosts: 27,
  activeUsers: 342,
  comments: 2354,
  newUsers: 120,
  apiMetrics: {
    latency: "230ms",
    errorRate: "0.3%",
  },
  recentBackup: "2 hours ago",

  // ─────────────────────────────
  // 🤖 AI USAGE DATA
  // ─────────────────────────────
  aiUsage: {
    aiGenerated: 45,
    userWritten: 35,
    hybrid: 20,
  },

  // ─────────────────────────────
  // 📈 CHART DATA
  // ─────────────────────────────
  userGrowth: [
    { week: "W1", users: 200 },
    { week: "W2", users: 400 },
    { week: "W3", users: 600 },
    { week: "W4", users: 800 },
  ],

  engagementData: [
    { day: "Mon", Morning: 30, Afternoon: 50, Evening: 70 },
    { day: "Tue", Morning: 40, Afternoon: 55, Evening: 60 },
    { day: "Wed", Morning: 45, Afternoon: 60, Evening: 80 },
    { day: "Thu", Morning: 35, Afternoon: 50, Evening: 75 },
    { day: "Fri", Morning: 55, Afternoon: 65, Evening: 90 },
    { day: "Sat", Morning: 60, Afternoon: 70, Evening: 95 },
    { day: "Sun", Morning: 50, Afternoon: 55, Evening: 85 },
  ],

  // ─────────────────────────────
  // 👥 ACTIVE USERS & TRENDING POSTS
  // ─────────────────────────────
  topActiveUsers: [
    { username: "alex", posts: 42 },
    { username: "maria", posts: 39 },
    { username: "rahul", posts: 33 },
    { username: "lisa", posts: 30 },
    { username: "tom", posts: 27 },
  ],

  trendingThoughts: [
    { title: "The Power of AI", likes: 230, comments: 45 },
    { title: "Mind & Machine", likes: 210, comments: 32 },
    { title: "Creativity Reimagined", likes: 190, comments: 41 },
    { title: "Shared Consciousness", likes: 150, comments: 25 },
    { title: "Ethics of AI", likes: 130, comments: 20 },
  ],

  // ─────────────────────────────
  // ⚙️ MODERATION SNAPSHOT
  // ─────────────────────────────
  moderation: {
    reportedPosts: 12,
    bannedUsers: 3,
    editedContent: 8,
    roleUpdates: 4,
    autoModeration: 5,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Example: dynamic updates if you fetch new metrics
    updateDashboardData: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
