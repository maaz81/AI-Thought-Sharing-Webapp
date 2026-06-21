import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
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
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

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
                const res = await api.get(`/profile/${username}`);
                setProfileData(res.data.user);
                setPosts(res.data.posts || []);
                setFollowersCount(res.data.followersCount || 0);
                setFollowingCount(res.data.followingCount || 0);

                // Check if following
                if (currentUser && res.data.user) {
                    // We need to check if *currentUser* follows *this profile user*
                    // We can fetch the current user's following list
                    try {
                        const followingRes = await api.get(`/api/followers/following/${currentUser._id}`);
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
                await api.post(`/api/followers/unfollow/${profileData._id}`, {});
                setIsFollowing(false);
                setFollowersCount(prev => prev - 1);
            } else {
                await api.post(`/api/followers/follow/${profileData._id}`, {});
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
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
        <div className="min-h-screen overflow-x-hidden bg-brand-bg dark:bg-brandDark-bg text-brand-text dark:text-brandDark-text transition-colors duration-300">
            <Header />

            <main className="flex-1">

                {/* COVER SECTION */}
                <section className="relative h-64 md:h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-purple-600 to-brand-accent" />

                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                    <div className="absolute inset-0 bg-black/20" />
                </section>

                {/* CONTENT */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-16">

                    <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-8">

                        {/* PROFILE SIDEBAR */}
                        <aside className="lg:sticky lg:top-24 h-fit">

                            <div
                                className="
                bg-brand-surface/90
                dark:bg-brandDark-surface/90
                backdrop-blur-lg
                rounded-3xl
                shadow-xl
                border
                border-brand-border
                dark:border-brandDark-border
                p-6
              "
                            >

                                {/* AVATAR */}
                                <div className="flex justify-center">
                                    <div className="relative -mt-20">
                                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-brandDark-surface shadow-2xl">

                                            {profileData.userDetails?.basic_info?.photo &&
                                                profileData.userDetails?.basic_info?.photo !==
                                                "default.jpg" ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL ||
                                                        "http://localhost:5000"
                                                        }/uploads/${profileData.userDetails.basic_info.photo
                                                        }`}
                                                    alt={profileData.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-accent text-white text-6xl font-bold">
                                                    {profileData.name?.[0]?.toUpperCase()}
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>

                                {/* USER INFO */}
                                <div className="text-center mt-5">

                                    <h1 className="text-3xl font-bold">
                                        {profileData.name}
                                    </h1>

                                    <p className="text-brand-muted mt-1">
                                        @{profileData.username}
                                    </p>

                                    {profileData.userDetails?.basic_info?.bio && (
                                        <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                                            {profileData.userDetails.basic_info.bio}
                                        </p>
                                    )}

                                </div>

                                {/* META */}
                                <div className="space-y-3 mt-6 text-sm">

                                    {profileData.userDetails?.basic_info?.location && (
                                        <div className="flex items-center gap-3">
                                            <FiMapPin />
                                            <span>
                                                {profileData.userDetails.basic_info.location}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <FiCalendar />
                                        <span>
                                            Joined{" "}
                                            {new Date(
                                                profileData.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-3 mt-6">

                                    {currentUser?._id !== profileData._id && (
                                        <button
                                            onClick={handleFollowToggle}
                                            disabled={followLoading}
                                            className={`
                      flex-1
                      py-3
                      rounded-xl
                      font-semibold
                      transition-all
                      duration-300
                      ${isFollowing
                                                    ? "border border-brand-border"
                                                    : "bg-brand-primary text-white shadow-lg hover:scale-105"
                                                }
                    `}
                                        >
                                            {isFollowing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <FiUserCheck />
                                                    Following
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <FiUserPlus />
                                                    Follow
                                                </span>
                                            )}
                                        </button>
                                    )}

                                    <button
                                        className="
                    p-3
                    rounded-xl
                    border
                    border-brand-border
                    hover:border-brand-primary
                    transition-all
                  "
                                    >
                                        <FiMessageSquare size={20} />
                                    </button>

                                </div>

                                {/* STATS */}
                                <div className="grid grid-cols-3 gap-3 mt-8">

                                    <div className="bg-brand-bg dark:bg-brandDark-bg rounded-xl p-4 text-center">
                                        <div className="font-bold text-2xl">
                                            {posts.length}
                                        </div>
                                        <div className="text-xs uppercase tracking-wider">
                                            Posts
                                        </div>
                                    </div>

                                    <div className="bg-brand-bg dark:bg-brandDark-bg rounded-xl p-4 text-center">
                                        <div className="font-bold text-2xl">
                                            {followersCount}
                                        </div>
                                        <div className="text-xs uppercase tracking-wider">
                                            Followers
                                        </div>
                                    </div>

                                    <div className="bg-brand-bg dark:bg-brandDark-bg rounded-xl p-4 text-center">
                                        <div className="font-bold text-2xl">
                                            {followingCount}
                                        </div>
                                        <div className="text-xs uppercase tracking-wider">
                                            Following
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </aside>

                        {/* POSTS */}
                        <section className="min-w-0">

                            <div className="bg-brand-surface dark:bg-brandDark-surface rounded-3xl p-6 shadow-lg border border-brand-border dark:border-brandDark-border">

                                <h2 className="flex items-center gap-3 text-2xl font-bold mb-8">
                                    <span className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary">
                                        <FiUsers />
                                    </span>
                                    Recent Posts
                                </h2>

                                {posts.length > 0 ? (
                                    <div className="space-y-6">

                                        {posts.map((post, index) => (
                                            <motion.div
                                                key={post._id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.08 }}
                                                className="
                        group
                        rounded-2xl
                        border
                        border-brand-border
                        dark:border-brandDark-border
                        p-6
                        hover:shadow-xl
                        hover:-translate-y-1
                        transition-all
                        duration-300
                      "
                                            >

                                                <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">
                                                    {post.title}
                                                </h3>

                                                <div className="flex flex-wrap gap-2 mb-4">

                                                    {post.tags?.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              bg-brand-primary/10
                              text-brand-primary
                            "
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}

                                                </div>

                                                <p className="text-brand-muted leading-relaxed line-clamp-3">
                                                    {post.content}
                                                </p>

                                                <div className="flex justify-between items-center mt-5">

                                                    <span className="text-xs text-brand-muted">
                                                        {new Date(
                                                            post.createdAt
                                                        ).toLocaleDateString()}
                                                    </span>

                                                    <a
                                                        href={`/post/${post.postId || post._id}`}
                                                        className="
                            font-medium
                            text-brand-primary
                            hover:underline
                          "
                                                    >
                                                        Read More →
                                                    </a>

                                                </div>

                                            </motion.div>
                                        ))}

                                    </div>
                                ) : (
                                    <div className="py-20 text-center">
                                        <p className="text-brand-muted">
                                            No public posts available.
                                        </p>
                                    </div>
                                )}

                            </div>

                        </section>

                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
};

export default PublicProfile;
