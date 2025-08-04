import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const UpdatePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/update/post/${id}`, {
                    withCredentials: true
                });
                setPost({
                    ...res.data,
                    // Ensure tags is always an array
                    tags: Array.isArray(res.data.tags) ? res.data.tags : []
                });
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.put(`http://localhost:5000/api/update/post/${id}`, post, {
                withCredentials: true
            });
            navigate('/profile', { state: { message: 'Post updated successfully!' } });
        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to update post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmCancel = () => {
        if (window.confirm('Are you sure you want to cancel editing? Any unsaved changes will be lost.')) {
            navigate('/profile');
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-40 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="flex space-x-4">
                        <div className="h-10 bg-gray-200 rounded w-24"></div>
                        <div className="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error || 'Post not found or you may not have permission to edit it.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto p-4 sm:p-6"
        >
            <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Post
                    </h2>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={post.title}
                                onChange={(e) => setPost({ ...post, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                Content
                            </label>
                            <textarea
                                id="content"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[200px]"
                                value={post.content}
                                onChange={(e) => setPost({ ...post, content: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (comma separated)
                            </label>
                            <input
                                id="tags"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={post.tags.join(', ')}
                                onChange={(e) =>
                                    setPost({ ...post, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })
                                }
                                placeholder="technology, programming, web"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Separate tags with commas
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visibility
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPost({ ...post, visibility: 'public' })}
                                    className={`flex items-center px-4 py-2 rounded-lg border transition ${
                                        post.visibility === 'public'
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Public
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPost({ ...post, visibility: 'private' })}
                                    className={`flex items-center px-4 py-2 rounded-lg border transition ${
                                        post.visibility === 'private'
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Private
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={confirmCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-lg text-white transition ${
                            isSubmitting 
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        } flex items-center`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default UpdatePost;