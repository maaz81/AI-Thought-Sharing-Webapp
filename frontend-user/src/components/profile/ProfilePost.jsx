import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiClock, FiHeart, FiThumbsDown, FiTag, FiLoader, FiPlus } from 'react-icons/fi';
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
            <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                    <div className="w-14 h-14 border-3 border-brand-border dark:border-brandDark-border border-t-brand-primary rounded-full animate-spin"></div>
                    <FiLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-brand-primary text-lg" />
                </div>
                <p className="mt-4 text-brand-muted dark:text-brandDark-muted">
                    Loading your posts...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-brand-text dark:text-brandDark-text">
                        Your Posts
                    </h2>
                    <p className="text-brand-muted dark:text-brandDark-muted mt-1">
                        Manage and review all your published content
                    </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <span className="text-sm font-medium px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                    </span>
                    <button
                        onClick={() => navigate('/profile/post')}
                        className="flex items-center px-4 py-2.5 bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:from-brand-primaryHover hover:to-brand-primary text-white font-medium rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <FiPlus className="mr-2" /> Create New
                    </button>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-brand-bg/50 to-white dark:from-brandDark-bg/50 dark:to-brandDark-surface rounded-2xl border border-brand-border/50 dark:border-brandDark-border/50">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-full flex items-center justify-center mb-5">
                        <FiEdit2 className="text-brand-primary text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-brand-text dark:text-brandDark-text mb-2">
                        No posts yet
                    </h3>
                    <p className="text-brand-muted dark:text-brandDark-muted max-w-md mx-auto mb-6">
                        Share your thoughts and ideas with the community. Your first post is just a click away!
                    </p>
                    <button
                        onClick={() => navigate('/profile/post')}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:from-brand-primaryHover hover:to-brand-primary text-white font-medium rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <FiPlus className="mr-2" /> Create Your First Post
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <div 
                            key={post._id} 
                            className="group bg-brand-surface dark:bg-brandDark-surface rounded-2xl border border-brand-border dark:border-brandDark-border shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="p-6">
                                {/* Post Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3
                                            className="text-xl font-bold text-brand-text dark:text-brandDark-text hover:text-brand-primary dark:hover:text-brand-primary cursor-pointer transition-colors duration-200 line-clamp-2"
                                            onClick={() => navigate(`/post/${post._id}`)}
                                        >
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center mt-2 text-sm text-brand-muted dark:text-brandDark-muted">
                                            <FiClock className="mr-1.5 flex-shrink-0" />
                                            <span>{post.formattedDate}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {/* Reaction Stats */}
                                        <div className="flex items-center space-x-4 bg-brand-bg dark:bg-brandDark-bg px-3 py-2 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="p-1.5 rounded-md bg-state-success/10 mr-2">
                                                    <FiHeart className="text-state-success" size={14} />
                                                </div>
                                                <span className="font-medium text-brand-text dark:text-brandDark-text">
                                                    {post.likes}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="p-1.5 rounded-md bg-state-error/10 mr-2">
                                                    <FiThumbsDown className="text-state-error" size={14} />
                                                </div>
                                                <span className="font-medium text-brand-text dark:text-brandDark-text">
                                                    {post.dislikes}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="mb-5">
                                    <p className="text-brand-text dark:text-brandDark-text leading-relaxed line-clamp-3">
                                        {post.content}
                                    </p>
                                </div>

                                {/* Tags */}
                                {post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={`${post._id}-${tag}-${index}`}
                                                className="inline-flex items-center px-3 py-1.5 bg-brand-primary/10 text-brand-primary dark:text-brand-primary text-xs font-medium rounded-lg"
                                            >
                                                <FiTag className="mr-1.5" size={12} /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 pt-5 border-t border-brand-border dark:border-brandDark-border">
                                    <button
                                        onClick={() => navigate(`/post/${post._id}`)}
                                        className="px-4 py-2 text-sm font-medium text-brand-primary dark:text-brand-primary hover:text-brand-primaryHover border border-brand-primary/30 hover:border-brand-primary/50 rounded-lg transition-colors duration-200"
                                    >
                                        View Post
                                    </button>
                                    <button
                                        onClick={() => navigate(`/profile/post/update/${post._id}`)}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-brand-text dark:text-brandDark-text hover:text-brand-primary bg-brand-bg dark:bg-brandDark-bg hover:bg-brand-primary/5 rounded-lg transition-colors duration-200"
                                    >
                                        <FiEdit2 className="mr-2" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        disabled={deletingId === post._id}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-state-error hover:text-state-error/80 bg-state-error/10 hover:bg-state-error/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePost;