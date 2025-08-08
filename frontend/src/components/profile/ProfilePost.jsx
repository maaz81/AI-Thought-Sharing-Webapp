import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiClock, FiHeart, FiThumbsDown, FiTag, FiLoader } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const ProfilePost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/profile/post', {
                    withCredentials: true,
                });

                const data = res.data;

                if (Array.isArray(data)) {
                    const enhancedPosts = data
                        .map(post => ({
                            ...post,
                            likes: post.likes || 0,
                            dislikes: post.dislikes || 0,
                            userReaction: null,
                            formattedDate: formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })
                        }))
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                    setPosts(enhancedPosts);
                } else {
                    setPosts([]);
                }

            } catch (error) {
                console.error('Error fetching user posts:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    const handleDelete = async (postId) => {
        const confirm = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
        if (!confirm) return;

        setDeletingId(postId);
        try {
            await axios.delete(`http://localhost:5000/api/update/post/${postId}`, {
                withCredentials: true,
            });

            setPosts((prev) => prev.filter((post) => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete the post. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <FiLoader className="animate-spin text-3xl text-blue-500 mb-4" />
                <p className="text-gray-600">Loading your posts...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6 dark:pt-4 dark:pl-8">
                <h2 className="text-2xl font-bold text-gray-800">Your Posts</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full dark:mr-4">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm dark:bg-gray-900 dark:text-white">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiEdit2 className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">No posts yet</h3>
                    <p className="text-gray-500 mt-1">When you create posts, they'll appear here</p>
                    <button
                        onClick={() => navigate('/create-post')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                    >
                        Create Your First Post
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <div key={post._id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3
                                        className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
                                        onClick={() => navigate(`/post/${post._id}`)}
                                    >
                                        {post.title}
                                    </h3>
                                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded flex items-center">
                                        <FiClock className="mr-1" /> {post.formattedDate}
                                    </span>
                                </div>

                                <p className="text-gray-600 my-3">{post.content}</p>

                                {post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={`${post._id}-${tag}-${index}`}
                                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full flex items-center"
                                            >
                                                <FiTag className="mr-1" size={12} /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                    <span className="flex items-center">
                                        <FiHeart className="mr-1 text-red-500" /> {post.likes}
                                    </span>
                                    <span className="flex items-center">
                                        <FiThumbsDown className="mr-1 text-gray-500" /> {post.dislikes}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end space-x-3">
                                <button
                                    onClick={() => navigate(`/profile/post/update/${post._id}`)}
                                    className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition"
                                >
                                    <FiEdit2 className="mr-2" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    disabled={deletingId === post._id}
                                    className="flex items-center text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {deletingId === post._id ? (
                                        <>
                                            <FiLoader className="animate-spin mr-2" /> Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <FiTrash2 className="mr-2" /> Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePost;