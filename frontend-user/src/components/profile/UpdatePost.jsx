import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FiEdit2, 
  FiX, 
  FiEye, 
  FiLock, 
  FiSave, 
  FiLoader, 
  FiTag,
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';

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
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="h-8 bg-brand-border dark:bg-brandDark-border rounded w-1/3 animate-pulse"></div>
                    <div className="h-12 bg-brand-border dark:bg-brandDark-border rounded animate-pulse"></div>
                    <div className="h-48 bg-brand-border dark:bg-brandDark-border rounded animate-pulse"></div>
                    <div className="h-12 bg-brand-border dark:bg-brandDark-border rounded animate-pulse"></div>
                    <div className="flex space-x-4">
                        <div className="h-12 bg-brand-border dark:bg-brandDark-border rounded w-32 animate-pulse"></div>
                        <div className="h-12 bg-brand-border dark:bg-brandDark-border rounded w-32 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-state-error/10 border-l-4 border-state-error p-5 rounded-r-lg">
                        <div className="flex items-start">
                            <FiAlertCircle className="h-6 w-6 text-state-error mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-state-error font-medium">
                                    {error || 'Post not found or you may not have permission to edit it.'}
                                </p>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="mt-4 inline-flex items-center text-sm text-brand-primary hover:text-brand-primaryHover transition-colors"
                                >
                                    <FiArrowLeft className="mr-2" /> Back to Profile
                                </button>
                            </div>
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
            className="container mx-auto px-4 py-8"
        >
            <form onSubmit={handleUpdate} className="max-w-2xl mx-auto">
                <div className="bg-brand-surface dark:bg-brandDark-surface rounded-2xl shadow-soft overflow-hidden border border-brand-border dark:border-brandDark-border transition-colors duration-300">
                    {/* Header */}
                    <div className="border-b border-brand-border dark:border-brandDark-border px-6 py-4 bg-gradient-to-r from-brand-bg/50 to-transparent dark:from-brandDark-bg/50">
                        <div className="flex items-center">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 mr-4">
                                <FiEdit2 className="text-2xl text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text dark:text-brandDark-text">
                                    Edit Post
                                </h2>
                                <p className="text-sm text-brand-muted dark:text-brandDark-muted">
                                    Update your post content and settings
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {error && (
                            <div className="mb-8 bg-state-error/10 border border-state-error/20 rounded-xl p-4">
                                <div className="flex items-start">
                                    <FiAlertCircle className="h-5 w-5 text-state-error mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-state-error font-medium">
                                            {error}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setError(null)}
                                        className="ml-auto text-state-error hover:text-state-error/80"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            {/* Title Field */}
                            <div className="group">
                                <label htmlFor="title" className="block text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                                    value={post.title}
                                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                                    required
                                    placeholder="Enter post title"
                                />
                            </div>

                            {/* Content Field */}
                            <div className="group">
                                <label htmlFor="content" className="block text-sm font-medium text-brand-text dark:text-brandDark-text mb-3">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted min-h-[250px] resize-y transition-colors duration-200 outline-none"
                                    value={post.content}
                                    onChange={(e) => setPost({ ...post, content: e.target.value })}
                                    required
                                    placeholder="Write your post content here..."
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-brand-muted dark:text-brandDark-muted">
                                        Markdown is supported
                                    </p>
                                    <span className="text-xs text-brand-muted dark:text-brandDark-muted">
                                        {post.content.length} characters
                                    </span>
                                </div>
                            </div>

                            {/* Tags Field */}
                            <div className="group">
                                <div className="flex items-center justify-between mb-3">
                                    <label htmlFor="tags" className="text-sm font-medium text-brand-text dark:text-brandDark-text">
                                        Tags
                                    </label>
                                    <FiTag className="text-brand-muted dark:text-brandDark-muted" />
                                </div>
                                <input
                                    id="tags"
                                    type="text"
                                    className="w-full px-5 py-3.5 bg-brand-bg dark:bg-brandDark-bg border-2 border-brand-border dark:border-brandDark-border rounded-xl focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 text-brand-text dark:text-brandDark-text placeholder:text-brand-muted dark:placeholder:text-brandDark-muted transition-colors duration-200 outline-none"
                                    value={post.tags.join(', ')}
                                    onChange={(e) =>
                                        setPost({ ...post, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })
                                    }
                                    placeholder="technology, programming, web development"
                                />
                                <p className="mt-2 text-sm text-brand-muted dark:text-brandDark-muted">
                                    Separate tags with commas. {post.tags.length} tag(s) added.
                                </p>
                                
                                {/* Tags Preview */}
                                {post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-medium rounded-lg"
                                            >
                                                <FiTag className="mr-1.5" size={12} /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Visibility Toggle */}
                            <div className="group">
                                <label className="block text-sm font-medium text-brand-text dark:text-brandDark-text mb-4">
                                    Visibility
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPost({ ...post, visibility: 'public' })}
                                        className={`flex items-center justify-center px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                                            post.visibility === 'public'
                                                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-md'
                                                : 'border-brand-border dark:border-brandDark-border text-brand-text dark:text-brandDark-text hover:bg-brand-bg dark:hover:bg-brandDark-bg hover:border-brand-border/60'
                                        }`}
                                    >
                                        <FiEye className="mr-3 text-xl" />
                                        <div className="text-left">
                                            <div className="font-medium">Public</div>
                                            <div className="text-xs text-brand-muted dark:text-brandDark-muted mt-1">
                                                Visible to everyone
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPost({ ...post, visibility: 'private' })}
                                        className={`flex items-center justify-center px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                                            post.visibility === 'private'
                                                ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-md'
                                                : 'border-brand-border dark:border-brandDark-border text-brand-text dark:text-brandDark-text hover:bg-brand-bg dark:hover:bg-brandDark-bg hover:border-brand-border/60'
                                        }`}
                                    >
                                        <FiLock className="mr-3 text-xl" />
                                        <div className="text-left">
                                            <div className="font-medium">Private</div>
                                            <div className="text-xs text-brand-muted dark:text-brandDark-muted mt-1">
                                                Only visible to you
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-brand-border dark:border-brandDark-border px-6 py-5 bg-gradient-to-r from-transparent to-brand-bg/30 dark:to-brandDark-bg/30">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <button
                                type="button"
                                onClick={confirmCancel}
                                disabled={isSubmitting}
                                className="px-6 py-3 border-2 border-brand-border dark:border-brandDark-border text-brand-text dark:text-brandDark-text hover:bg-brand-bg dark:hover:bg-brandDark-bg rounded-xl font-medium transition-all duration-300 hover:shadow-sm disabled:opacity-50 w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center w-full sm:w-auto ${
                                    isSubmitting
                                        ? 'bg-brand-primary/70 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:from-brand-primaryHover hover:to-brand-primary hover:shadow-lg hover:-translate-y-0.5'
                                } text-white`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FiLoader className="animate-spin mr-3" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="mr-3" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default UpdatePost;