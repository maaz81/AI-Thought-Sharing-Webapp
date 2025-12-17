import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { FiUserPlus, FiUserCheck, FiMessageSquare, FiMapPin, FiCalendar, FiLink, FiUsers } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const PublicProfile = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        // Get current user from local storage
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (storedUser && storedUser.user) {
            setCurrentUser(storedUser.user);
        }
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                // Fetch Public Profile Data
                const res = await axios.get(`http://localhost:5000/profile/${username}`);
                setProfileData(res.data.user);
                setPosts(res.data.posts || []);

                // Check if following
                if (currentUser && res.data.user) {
                    // We need to check if *currentUser* follows *this profile user*
                    // We can fetch the current user's following list
                    try {
                        const followingRes = await axios.get(`http://localhost:5000/api/followers/following/${currentUser._id}`, { withCredentials: true });
                        const followingList = followingRes.data.following || [];
                        const isFound = followingList.some(u => u._id === res.data.user._id);
                        setIsFollowing(isFound);
                    } catch (err) {
                        console.error("Failed to check follow status", err);
                    }
                }

            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("User not found or server error");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username, currentUser?._id]); // Add currentUser._id dependency to re-check if user logs in

    const handleFollowToggle = async () => {
        if (!currentUser) {
            alert("Please login to follow users.");
            return;
        }
        if (!profileData) return;

        setFollowLoading(true);
        try {
            if (isFollowing) {
                await axios.post(`http://localhost:5000/api/followers/unfollow/${profileData._id}`, {}, { withCredentials: true });
                setIsFollowing(false);
            } else {
                await axios.post(`http://localhost:5000/api/followers/follow/${profileData._id}`, {}, { withCredentials: true });
                setIsFollowing(true);
            }
        } catch (err) {
            console.error("Follow action failed", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-bg dark:bg-brandDark-bg flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen bg-brand-bg dark:bg-brandDark-bg flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center text-brand-muted dark:text-brandDark-muted">
                    <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
                    <p>The user @{username} does not exist or unavailable.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg dark:bg-brandDark-bg flex flex-col font-sans text-brand-text dark:text-brandDark-text transition-colors duration-300">
            <Header />

            <main className="flex-1">
                {/* Cover Image Area */}
                <div className="h-48 md:h-64 bg-gradient-to-r from-brand-primary to-brand-accent relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    {/* Optional: Pattern or Abstract Shape */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container px-4 mx-auto -mt-20 md:-mt-24 relative z-10 pb-12">
                    <div className="flex flex-col md:flex-row items-start md:gap-8">

                        {/* Profile Card Sidebar */}
                        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
                            <div className="bg-brand-surface dark:bg-brandDark-surface rounded-2xl shadow-soft p-6 border border-brand-border dark:border-brandDark-border backdrop-blur-sm">
                                {/* Avatar */}
                                <div className="relative -mt-16 mb-4">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-brand-surface dark:border-brandDark-surface shadow-md overflow-hidden bg-brand-bg dark:bg-brandDark-bg">
                                        {profileData.userDetails?.basic_info?.photo && profileData.userDetails?.basic_info?.photo !== 'default.jpg' ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${profileData.userDetails.basic_info.photo}`}
                                                alt={profileData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 text-brand-primary text-5xl font-bold">
                                                {profileData.name?.[0]?.toUpperCase() || profileData.username?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Name & Bio */}
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-brand-text dark:text-brandDark-text">{profileData.name}</h1>
                                    <p className="text-brand-muted dark:text-brandDark-muted font-medium mb-4">@{profileData.username}</p>

                                    {profileData.userDetails?.basic_info?.bio && (
                                        <p className="text-sm text-brand-text/80 dark:text-brandDark-text/80 leading-relaxed mb-4">
                                            {profileData.userDetails.basic_info.bio}
                                        </p>
                                    )}

                                    {/* Meta Info */}
                                    <div className="space-y-2 text-sm text-brand-muted dark:text-brandDark-text/60">
                                        {profileData.userDetails?.basic_info?.location && (
                                            <div className="flex items-center gap-2">
                                                <FiMapPin /> <span>{profileData.userDetails.basic_info.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <FiCalendar /> <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mb-6">
                                    {currentUser?._id !== profileData._id && (
                                        <button
                                            onClick={handleFollowToggle}
                                            disabled={followLoading}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${isFollowing
                                                ? "bg-brand-surface dark:bg-brandDark-surface border-2 border-brand-border dark:border-brandDark-border text-brand-text dark:text-brandDark-text hover:bg-brand-bg dark:hover:bg-brandDark-bg"
                                                : "bg-brand-primary text-white hover:bg-brand-primaryHover shadow-lg shadow-brand-primary/30"
                                                }`}
                                        >
                                            {isFollowing ? <><FiUserCheck /> Following</> : <><FiUserPlus /> Follow</>}
                                        </button>
                                    )}
                                    <button className="p-3 rounded-xl border-2 border-brand-border dark:border-brandDark-border text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-all duration-200">
                                        <FiMessageSquare size={20} />
                                    </button>
                                </div>

                                {/* Follow Stats (Optional - using dummy or if available) */}
                                <div className="flex items-center justify-around py-4 border-t border-brand-border dark:border-brandDark-border">
                                    <div className="text-center">
                                        <div className="font-bold text-xl text-brand-text dark:text-brandDark-text">{posts.length}</div>
                                        <div className="text-xs text-brand-muted uppercase tracking-wider">Posts</div>
                                    </div>
                                    {/* Note: Following/Followers counts would need extra backend support or multiple fetching. Keeping it simple or fetching if critical. */}
                                </div>

                            </div>
                        </div>

                        {/* Main Feed */}
                        <div className="flex-1 mt-8 md:mt-24 w-full">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-text dark:text-brandDark-text border-b border-brand-border dark:border-brandDark-border pb-4">
                                <span className="bg-brand-primary/10 text-brand-primary p-2 rounded-lg"><FiUsers /></span>
                                Recent Posts
                            </h2>

                            {posts.length > 0 ? (
                                <div className="grid gap-6">
                                    <AnimatePresence>
                                        {posts.map((post, index) => (
                                            <motion.div
                                                key={post._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-brand-surface dark:bg-brandDark-surface p-6 rounded-2xl shadow-soft border border-brand-border dark:border-brandDark-border hover:shadow-md transition-shadow duration-300"
                                            >
                                                <div className="mb-4">
                                                    <h3 className="text-xl font-bold text-brand-text dark:text-brandDark-text mb-2 line-clamp-2">{post.title}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-brand-muted">
                                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                        {post.tags && post.tags.map(tag => (
                                                            <span key={tag} className="bg-brand-bg dark:bg-brandDark-bg px-2 py-0.5 rounded-full text-brand-text/70">#{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-brand-text/80 dark:text-brandDark-text/80 line-clamp-3 mb-4 leading-relaxed">
                                                    {post.content}
                                                </p>
                                                <div className="flex items-center justify-end">
                                                    <a href={`/post/${post.postId || post._id}`} className="text-sm font-medium text-brand-primary hover:text-brand-primaryHover transition-colors">
                                                        Read Full Post &rarr;
                                                    </a>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-brand-surface dark:bg-brandDark-surface rounded-2xl border border-dashed border-brand-border dark:border-brandDark-border">
                                    <p className="text-brand-muted dark:text-brandDark-muted">No public posts yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PublicProfile;
