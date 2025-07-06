import { useState, useEffect } from "react";
import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';
import SearchBar from "./SearchBar";
import axios from 'axios';
import { io } from 'socket.io-client';

const PostCard = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null); // 🌟 Track selected post
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("http://localhost:5000/post");

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setStatus(response.status);

                if (Array.isArray(data)) {
                    const enhancedPosts = data.map(post => ({
                        ...post,
                        likes: post.likes || 0,
                        dislikes: post.dislikes || 0,
                        userReaction: null
                    })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                    setPosts(enhancedPosts);
                    setSelectedPost(enhancedPosts[0] || null); 
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setStatus(error.message);
                setError(error.message);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('postCreated', (newPost) => {
            setPosts((prev) => [newPost, ...prev]);
        });

        socket.on('postUpdated', (updatedPost) => {
            setPosts((prev) =>
                prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
            );
        });

        socket.on('postDeleted', (deletedPostId) => {
            setPosts((prev) => prev.filter((post) => post._id !== deletedPostId));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleReaction = async (postId, reactionType) => {
        try {
            await axios.post(
                `http://localhost:5000/profile/like/${postId}`,
                { reaction: reactionType },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post._id !== postId) return post;

                    let newLikes = post.likes || 0;
                    let newDislikes = post.dislikes || 0;
                    let newUserReaction = post.userReaction;

                    if (reactionType === 'like') {
                        if (post.userReaction === 'like') {
                            newLikes -= 1;
                            newUserReaction = null;
                        } else {
                            newLikes += 1;
                            if (post.userReaction === 'dislike') newDislikes -= 1;
                            newUserReaction = 'like';
                        }
                    } else if (reactionType === 'dislike') {
                        if (post.userReaction === 'dislike') {
                            newDislikes -= 1;
                            newUserReaction = null;
                        } else {
                            newDislikes += 1;
                            if (post.userReaction === 'like') newLikes -= 1;
                            newUserReaction = 'dislike';
                        }
                    }

                    return {
                        ...post,
                        likes: newLikes,
                        dislikes: newDislikes,
                        userReaction: newUserReaction,
                    };
                })
            );
        } catch (error) {
            console.error('Reaction error:', error);
            alert('You need to be logged in to react to posts.');
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay error={error} />;
    if (posts.length === 0) return <NoPosts status={status} />;

    return (
        <>
            <Header />
            <SearchBar />

            <div className="flex flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
                {/* Left Side - List */}
                <div className="w-1/2 space-y-6">
                    {posts.map((post) => (
                        <PostCardDisplay
                            key={post._id}
                            post={post}
                            handleReaction={handleReaction}
                            onClick={() => setSelectedPost(post)} // 👈 set selected post
                        />
                    ))}
                </div>

                {/* Right Side - Post Details */}
                <div className="w-1/2">
                    {selectedPost ? (
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 sticky top-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold text-gray-800">{selectedPost.title}</h2>
                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-gray-600">{selectedPost.content}</p>

                            <div className="flex flex-wrap gap-2">
                                {(selectedPost.tags || []).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex space-x-4 pt-2">
                                <span className="text-green-600">👍 {selectedPost.likes}</span>
                                <span className="text-red-600">👎 {selectedPost.dislikes}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 italic text-center pt-16">Click on a post to see details</div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

// Subcomponent to render a clickable post
const PostCardDisplay = ({ post, handleReaction, onClick }) => (
    <div
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={onClick}
    >
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
            <p className="text-gray-600 line-clamp-2">{post.content}</p>

            <div className="flex flex-wrap gap-2">
                {(post.tags || []).map((tag, index) => (
                    <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center space-x-4 pt-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleReaction(post._id, 'like');
                    }}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${post.userReaction === 'like' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <span className="text-lg">👍</span>
                    <span>{post.likes}</span>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleReaction(post._id, 'dislike');
                    }}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${post.userReaction === 'dislike' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <span className="text-lg">👎</span>
                    <span>{post.dislikes}</span>
                </button>
            </div>
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        ))}
    </div>
);

const ErrorDisplay = ({ error }) => (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Failed to load posts</h2>
            <p className="text-red-600 mb-4">{error}</p>
        </div>
    </div>
);

const NoPosts = ({ status }) => (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">No posts found</h2>
            <p className="text-blue-600">Status: {status}</p>
        </div>
    </div>
);

export default PostCard;
