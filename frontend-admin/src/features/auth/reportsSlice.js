// src/features/reports/reportsSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Dummy Data Updated with Reports and Report Status
const dummyReportedPosts = [
  {
    _id: '1',
    title: 'Spam Post',
    user: { username: 'john_doe' },
    details: {
      visibility: 'hidden',
      reports: 5,
      reportStatus: 'Pending',
    },
    createdAt: '2025-10-01T10:30:00Z',
  },
  {
    _id: '2',
    title: 'Inappropriate Content',
    user: { username: 'jane_smith' },
    details: {
      visibility: 'hidden',
      reports: 3,
      reportStatus: 'Reviewed',
    },
    createdAt: '2025-10-03T12:00:00Z',
  },
  {
    _id: '3',
    title: 'Fake News',
    user: { username: 'news_bot' },
    details: {
      visibility: 'hidden',
      reports: 7,
      reportStatus: 'Pending',
    },
    createdAt: '2025-10-04T09:00:00Z',
  },
];

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    reportedPosts: dummyReportedPosts,
    loading: false,
    error: null,
  },
  reducers: {
    deleteReportedPost: (state, action) => {
      state.reportedPosts = state.reportedPosts.filter(
        (post) => post._id !== action.payload
      );
    },
  },
});

// Actions
export const { deleteReportedPost } = reportsSlice.actions;

// Selectors
export const selectReportedPosts = (state) => state.reports.reportedPosts;
export const selectReportsLoading = (state) => state.reports.loading;

export default reportsSlice.reducer;
