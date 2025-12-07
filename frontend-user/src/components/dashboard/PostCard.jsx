import { useState, useEffect } from "react";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import SearchBar from "./SearchBar";
import axios from "axios";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// 🔹 helper to format a post consistently
const formatPost = (post) => ({
  ...post,
  likes: post.likes || 0,
  dislikes: post.dislikes || 0,
  userReaction: post.userReaction || null,
  createdAt: new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
});

const PostCard = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Initial fetch
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        let res1Data = [];
        let res2Data = [];

        try {
          const res1 = await axios.get("http://localhost:5000/api/post");
          if (Array.isArray(res1.data)) {
            res1Data = res1.data;
          }
        } catch (err) {
          console.warn("res1 fetch failed, defaulting to empty array");
          res1Data = [];
        }

        try {
          const res2 = await axios.get(
            "http://localhost:5000/api/setpost/getposts"
          );
          if (Array.isArray(res2.data)) {
            res2Data = res2.data;
          }
        } catch (err) {
          console.warn("res2 fetch failed, defaulting to empty array");
          res2Data = [];
        }

        const combinedData = [...res1Data, ...res2Data];

        if (combinedData.length > 0) {
          const enhancedPosts = combinedData
            .filter((post) => post.visibility === "public") // ✅ only public
            .map(formatPost)
            .sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );

          setPosts(enhancedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError(error.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 🔹 Socket listeners
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("postCreated", (newPost) => {
      // ignore private posts in public feed
      if (newPost.visibility !== "public") return;

      setPosts((prev) => [formatPost(newPost), ...prev]);
    });

    socket.on("postUpdated", (updatedPost) => {
      setPosts((prev) => {
        // if post turned private → remove from feed
        if (updatedPost.visibility !== "public") {
          return prev.filter((post) => post._id !== updatedPost._id);
        }

        // else update in place
        return prev.map((post) =>
          post._id === updatedPost._id
            ? {
                ...post,
                ...formatPost(updatedPost),
                createdAt: post.createdAt, // keep existing formatted date
              }
            : post
        );
      });
    });

    socket.on("postDeleted", (deletedPostId) => {
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
            "Content-Type": "application/json",
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) return post;

          let newLikes = post.likes || 0;
          let newDislikes = post.dislikes || 0;
          let newUserReaction = post.userReaction;

          if (reactionType === "like") {
            if (post.userReaction === "like") {
              newLikes -= 1;
              newUserReaction = null;
            } else {
              newLikes += 1;
              if (post.userReaction === "dislike") newDislikes -= 1;
              newUserReaction = "like";
            }
          } else if (reactionType === "dislike") {
            if (post.userReaction === "dislike") {
              newDislikes -= 1;
              newUserReaction = null;
            } else {
              newDislikes += 1;
              if (post.userReaction === "like") newLikes -= 1;
              newUserReaction = "dislike";
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
      console.error("Reaction error:", error);
      alert("You need to be logged in to react to posts.");
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags &&
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;


    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-white">
            <Header />

            <div className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <SearchBar onSearch={setSearchQuery} />
                    </div>

                    {/* Main Content */}
                    <div className={`flex flex-col lg:flex-row gap-8 transition-all duration-300 ${selectedPost ? 'lg:flex-row' : ''}`}>
                        {/* Post List */}
                        <div className={`${selectedPost ? 'lg:w-1/2' : 'w-full'} transition-all duration-300`}>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Recent Posts</h2>

                            {filteredPosts.length === 0 ? (
                                <NoPosts status={status} />
                            ) : (
                                <div className="space-y-6">
                                    <AnimatePresence>
                                        {filteredPosts.map((post) => (
                                            <motion.div
                                                key={post._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <PostCardDisplay
                                                    post={post}
                                                    handleReaction={handleReaction}
                                                    onClick={() => setSelectedPost(post)}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Post Details */}
                        <AnimatePresence>
                            {selectedPost && (
                                <motion.div
                                    className="lg:w-1/2 sticky top-28 self-start"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">{selectedPost.title}</h2>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Posted on {selectedPost.createdAt}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedPost(null)}
                                                className="text-gray-400 hover:text-red-500 transition-colors text-lg p-1 -mr-2"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="prose max-w-none text-gray-700">
                                            {selectedPost.content.split('\n').map((paragraph, i) => (
                                                <p key={i}>{paragraph}</p>
                                            ))}
                                        </div>

                                        {selectedPost.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPost.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleReaction(selectedPost._id, 'like')}
                                                    className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-colors ${selectedPost.userReaction === 'like' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                                >
                                                    <span className="text-xl">👍</span>
                                                    <span>{selectedPost.likes}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleReaction(selectedPost._id, 'dislike')}
                                                    className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-colors ${selectedPost.userReaction === 'dislike' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                                >
                                                    <span className="text-xl">👎</span>
                                                    <span>{selectedPost.dislikes}</span>
                                                </button>
                                            </div>

                                            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                                <span>Share</span>
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const PostCardDisplay = ({ post, handleReaction, onClick }) => {
    const navigate = useNavigate();

    const goToPostDetails = (e) => {
        e.stopPropagation(); // Prevent card selection
        navigate(`/post/${post.postId || post._id}`);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
            onClick={onClick}
        >
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800" onClick={goToPostDetails}>
                        {post.title}
                    </h2>
                    <span className="text-xs text-gray-500">{post.createdAt}</span>
                </div>

                <p className="text-gray-600 line-clamp-3">{post.content}</p>

                {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-blue-200 transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between pt-3">
                    <div className="flex space-x-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReaction(post._id, 'like');
                            }}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${post.userReaction === 'like' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <span className="text-lg">👍</span>
                            <span className="text-sm">{post.likes}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReaction(post._id, 'dislike');
                            }}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${post.userReaction === 'dislike' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <span className="text-lg">👎</span>
                            <span className="text-sm">{post.dislikes}</span>
                        </button>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPostDetails(e);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Read more →
                    </button>
                </div>
            </div>
        </motion.div>
    );
};


const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 space-y-4 animate-pulse border border-gray-100">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex justify-between pt-3">
                        <div className="flex gap-3">
                            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ErrorDisplay = ({ error }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800">Failed to load posts</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const NoPosts = ({ status }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm text-center">
            <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-blue-800">No posts found</h3>
            <p className="mt-1 text-sm text-blue-700">
                {status ? `Status: ${status}` : "There are no posts to display at this time."}
            </p>
            <div className="mt-6">
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Refresh
                </button>
            </div>
        </div>
    </div>
);

export default PostCard;