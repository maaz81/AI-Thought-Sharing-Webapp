import React, { useEffect, useState } from 'react';
import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, CalendarIcon, TagIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const PostDetails = () => {
    const { postId } = useParams(); 
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            setError(null);

            try {
                // Try the first request
                const res1 = await axios.get(`http://localhost:5000/api/post/${postId}`);
                setPage(res1.data);
            } catch (err1) {
                try {
                    // If first fails, try the second
                    const res2 = await axios.get(`http://localhost:5000/api/setpost/getposts/${postId}`);
                    setPage(res2.data);
                } catch (err2) {
                    console.error("Both requests failed:", err1, err2);
                    setError("Failed to fetch the page from both sources.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [postId]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-brand-bg dark:bg-brandDark-bg">
                <Header />
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex items-center justify-center"
                >
                    <div className="text-center space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="text-brand-muted dark:text-brandDark-muted font-medium">Loading post details...</p>
                    </div>
                </motion.div>
                <Footer />
            </div>
        );
    }

    // Error State
    if (error || !page) {
        return (
            <div className="min-h-screen flex flex-col bg-brand-bg dark:bg-brandDark-bg">
                <Header />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex items-center justify-center px-4"
                >
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-state-error/20 to-state-error/10 rounded-2xl flex items-center justify-center">
                                <ExclamationCircleIcon className="w-12 h-12 text-state-error" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-brand-text dark:text-brandDark-text">Page Not Found</h2>
                            <p className="text-brand-muted dark:text-brandDark-muted">
                                {error || "The post you're looking for doesn't exist or has been removed."}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryHover text-white font-semibold hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 hover:scale-105"
                            >
                                <ArrowLeftIcon className="w-5 h-5 inline mr-2" />
                                Go Back
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 rounded-xl bg-brand-surface dark:bg-brandDark-surface text-brand-primary border border-brand-border dark:border-brandDark-border font-semibold hover:bg-brand-bg dark:hover:bg-brandDark-bg transition-all duration-300"
                            >
                                Browse Posts
                            </button>
                        </div>
                    </div>
                </motion.div>
                <Footer />
            </div>
        );
    }

    // Success State
    return (
        <div className="min-h-screen flex flex-col bg-brand-bg dark:bg-brandDark-bg">
            <Header />
            
            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 py-8"
            >
                <div className="container">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-surface dark:bg-brandDark-surface text-brand-muted dark:text-brandDark-muted hover:text-brand-primary border border-brand-border dark:border-brandDark-border hover:border-brand-primary/30 transition-all duration-300 hover:shadow-soft group"
                        >
                            <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium">Back to Posts</span>
                        </button>
                    </div>

                    {/* Post Content */}
                    <div className="max-w-3xl mx-auto">
                        <motion.article 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-brand-surface dark:bg-brandDark-surface rounded-2xl shadow-soft border border-brand-border dark:border-brandDark-border overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-brand-border dark:border-brandDark-border">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold mb-3">
                                                Post
                                            </span>
                                            <h1 className="text-3xl md:text-4xl font-bold text-brand-text dark:text-brandDark-text leading-tight">
                                                {page.title}
                                            </h1>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 text-sm">
                                            <div className="flex items-center space-x-1.5 text-brand-muted dark:text-brandDark-muted">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>
                                                    {new Date(page.createdAt).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="prose prose-lg max-w-none 
                                    prose-headings:text-brand-text prose-headings:dark:text-brandDark-text
                                    prose-p:text-brand-text/80 prose-p:dark:text-brandDark-text/80
                                    prose-strong:text-brand-text prose-strong:dark:text-brandDark-text
                                    prose-li:text-brand-text/80 prose-li:dark:text-brandDark-text/80
                                    prose-a:text-brand-primary hover:prose-a:text-brand-primaryHover
                                    prose-blockquote:border-l-4 prose-blockquote:border-brand-primary
                                    prose-blockquote:bg-brand-primary/5 prose-blockquote:dark:bg-brand-primary/10
                                    prose-blockquote:italic prose-blockquote:pl-4
                                ">
                                    {page.content?.split('\n').map((paragraph, i) => (
                                        <p key={i} className="leading-relaxed mb-4">{paragraph}</p>
                                    )) || (
                                        <div className="text-center py-12">
                                            <p className="text-brand-muted dark:text-brandDark-muted italic">
                                                No content provided for this post.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            {page.tags?.length > 0 && (
                                <div className="p-8 border-t border-brand-border dark:border-brandDark-border bg-gradient-to-r from-brand-bg/30 to-transparent dark:from-brandDark-bg/30">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <TagIcon className="w-5 h-5 text-brand-muted dark:text-brandDark-muted" />
                                        <span className="font-semibold text-brand-text dark:text-brandDark-text">Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {page.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 text-brand-primary dark:text-brand-primary border border-brand-primary/20 rounded-full text-sm font-medium hover:from-brand-primary/20 hover:to-brand-accent/20 transition-all duration-200 cursor-pointer hover:scale-105"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="p-8 border-t border-brand-border dark:border-brandDark-border bg-brand-bg/30 dark:bg-brandDark-bg/30">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="px-6 py-3 rounded-xl bg-brand-surface dark:bg-brandDark-surface text-brand-text dark:text-brandDark-text border border-brand-border dark:border-brandDark-border hover:border-brand-primary/30 hover:shadow-soft transition-all duration-300 font-medium"
                                    >
                                        ← Back to All Posts
                                    </button>
                                    
                                    <div className="flex items-center space-x-3">
                                        <button className="p-2.5 rounded-xl bg-brand-surface dark:bg-brandDark-surface text-brand-muted hover:text-brand-primary border border-brand-border dark:border-brandDark-border hover:border-brand-primary/30 transition-all duration-300 hover:scale-105">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                        </button>
                                        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryHover text-white font-semibold hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 hover:scale-105">
                                            Save for Later
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    </div>
                </div>
            </motion.main>
            
            <Footer />
        </div>
    );
};

export default PostDetails;