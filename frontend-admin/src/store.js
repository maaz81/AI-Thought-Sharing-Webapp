import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import dashboardReducer from './features/dashboard/dashboardSlice';
import postsReducer from './features/posts/postsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    posts: postsReducer,
  },
});
