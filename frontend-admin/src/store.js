import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import dashboardReducer from "./features/auth/dashboardSlice";
import usersReducer from "./features/auth/usersSlice";
import usersPageReducer from "./features/auth/usersPageSlice"
import postsReducer from "./features/auth/postsStatsSlice"
import reportsReducer from "./features/auth/reportsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    usersPage: usersPageReducer,
    posts: postsReducer,
    reports: reportsReducer,
  },
});
