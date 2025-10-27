// src/pages/admin/Reports.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectReportedPosts,
    deleteReportedPost,
    selectReportsLoading
} from '../../features/auth/reportsSlice';
import Sidebar from '../dashboard/Sidebar';

const Reports = () => {
    const dispatch = useDispatch();
    const reportedPosts = useSelector(selectReportedPosts);
    const loading = useSelector(selectReportsLoading);

    const handleView = (postId) => {
        window.location.href = `/admin/post/${postId}`;
    };

    const handleDelete = (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            dispatch(deleteReportedPost(postId));
        }
    };

    if (loading) return <div className="p-6">Loading reported posts...</div>;

    return (
        <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 text-gray-900 dark:text-gray-100">
                <h2 className="text-2xl font-semibold mb-4">⚠️ Reported Posts</h2>
                {reportedPosts.length === 0 ? (
                    <p>No reported posts found.</p>
                ) : (
                    <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded p-4">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">User</th>
                                    <th className="px-4 py-2">Visibility</th>
                                    <th className="px-4 py-2">Reports</th>
                                    <th className="px-4 py-2">Report Status</th>
                                    <th className="px-4 py-2">Created</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportedPosts.map((post) => (
                                    <tr key={post._id} className="border-b dark:border-gray-700">
                                        <td className="px-4 py-2">{post.title}</td>
                                        <td className="px-4 py-2">{post.user?.username}</td>
                                        <td className="px-4 py-2">{post.details?.visibility}</td>
                                        <td className="px-4 py-2">{post.details?.reports || 0}</td>
                                        <td className="px-4 py-2">{post.details?.reportStatus || 'Pending'}</td>
                                        <td className="px-4 py-2">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => handleView(post._id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Reports;
