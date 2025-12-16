import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  FiUser,
  FiMessageSquare,
  FiCornerUpLeft,
  FiStar,
  FiLoader,
  FiEdit2,
  FiLogOut,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiUserCheck
} from "react-icons/fi";
import ProfilePost from "./ProfilePost";
import { useNavigate } from "react-router-dom";
import UserListModal from "./UserListModal";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userBio, setUserBio] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    replies: 0,
    contributions: 0
  });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [loadingFollows, setLoadingFollows] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileRes, statsRes, userPhotoRes, userBioRes] = await Promise.all([
          axios.get('http://localhost:5000/profile/', { withCredentials: true }),
          axios.get('http://localhost:5000/profile/stats', { withCredentials: true }),
          axios.get('http://localhost:5000/api/update/profile/userphoto', { withCredentials: true }),
          axios.get('http://localhost:5000/api/update/profile/userbio', { withCredentials: true }),

        ]);

        setUserData(profileRes.data);
        setStats(statsRes.data);

        const photoFilename = userPhotoRes.data;
        if (photoFilename) {
          setUserPhoto(`http://localhost:5000/uploads/${photoFilename}`);
        }

        setUserDetails(userPhotoRes.data);
        setUserBio(userBioRes.data || "No bio available");

      } catch (error) {
        console.error('Error fetching profile data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

  }, []);

  useEffect(() => {
    if (userData?._id) {
      const fetchFollowData = async () => {
        try {
          setLoadingFollows(true);
          const [followersRes, followingRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/followers/followers/${userData._id}`, { withCredentials: true }),
            axios.get(`http://localhost:5000/api/followers/following/${userData._id}`, { withCredentials: true })
          ]);
          setFollowers(followersRes.data.followers || []);
          setFollowing(followingRes.data.following || []);
        } catch (error) {
          console.error("Error fetching follow data", error);
        } finally {
          setLoadingFollows(false);
        }
      };
      fetchFollowData();
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePost />;
      case "comments":
        return (
          <div className="p-8 text-center">
            <FiMessageSquare className="mx-auto text-5xl mb-4 text-brand-muted/40 dark:text-brandDark-muted/40" />
            <h3 className="text-xl font-semibold text-brand-text dark:text-brandDark-text mb-2">
              Your Comments
            </h3>
            <p className="text-brand-muted dark:text-brandDark-muted max-w-md mx-auto">
              Comments you've made on posts will appear here
            </p>
          </div>
        );
      case "replies":
        return (
          <div className="p-8 text-center">
            <FiCornerUpLeft className="mx-auto text-5xl mb-4 text-brand-muted/40 dark:text-brandDark-muted/40" />
            <h3 className="text-xl font-semibold text-brand-text dark:text-brandDark-text mb-2">
              Your Replies
            </h3>
            <p className="text-brand-muted dark:text-brandDark-muted max-w-md mx-auto">
              Replies to your comments will appear here
            </p>
          </div>
        );
      case "contributions":
        return (
          <div className="p-8 text-center">
            <FiStar className="mx-auto text-5xl mb-4 text-brand-muted/40 dark:text-brandDark-muted/40" />
            <h3 className="text-xl font-semibold text-brand-text dark:text-brandDark-text mb-2">
              Your Contributions
            </h3>
            <p className="text-brand-muted dark:text-brandDark-muted max-w-md mx-auto">
              Your community contributions will appear here
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-border dark:border-brandDark-border border-t-brand-primary rounded-full animate-spin"></div>
          <FiLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-brand-primary text-xl" />
        </div>
        <p className="mt-4 text-brand-muted dark:text-brandDark-muted">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 transition-colors duration-300">
      {/* Profile Header */}
      <div className="bg-brand-surface dark:bg-brandDark-surface rounded-2xl shadow-soft overflow-hidden mb-8 relative transition-colors duration-300">
        {/* Background Banner */}
        <div className="bg-gradient-to-r from-brand-primary via-brand-primary/80 to-brand-accent/50 h-40"></div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-3">
          <button
            onClick={() => navigate('/profile/update')}
            className="flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:from-brand-primaryHover hover:to-brand-primary rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          >
            <FiEdit2 className="mr-2" /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-state-error/90 to-state-error hover:from-state-error hover:to-state-error/90 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-state-error/50"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>

        <div className="px-8 pb-8 relative">
          {/* Profile Image & Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-20 mb-6">
            <div className="relative mb-6 md:mb-0">
              <div className="h-40 w-40 rounded-2xl border-4 border-brand-surface dark:border-brandDark-surface bg-white dark:bg-brandDark-surface shadow-soft overflow-hidden transition-colors duration-300 group">
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="Profile"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-brand-bg to-brand-border dark:from-brandDark-border dark:to-brandDark-bg flex items-center justify-center">
                    <FiUser className="text-5xl text-brand-muted dark:text-brandDark-muted" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-state-success text-white text-xs font-bold px-2 py-1 rounded-full">
                Online
              </div>
            </div>

            <div className="md:ml-8 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-brand-text dark:text-brandDark-text mb-2">
                    {userData?.username || "User"}
                  </h1>
                  <p className="text-brand-muted dark:text-brandDark-muted text-lg mb-4 max-w-2xl">
                    {userBio}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
            </div>
            {/* Follow Stats in Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Followers */}
              <div
                onClick={() => setShowFollowersModal(true)}
                className="cursor-pointer bg-brand-bg dark:bg-brandDark-bg rounded-xl p-4 border border-brand-border dark:border-brandDark-border transition-all duration-300 hover:shadow-md hover:border-brand-primary/30 group"
              >
                <div className="text-2xl font-bold text-brand-text dark:text-brandDark-text mb-1 group-hover:text-brand-primary transition-colors">
                  {followers.length}
                </div>
                <div className="text-sm text-brand-muted dark:text-brandDark-muted capitalize flex items-center gap-2">
                  Followers <FiUsers />
                </div>
              </div>

              {/* Following */}
              <div
                onClick={() => setShowFollowingModal(true)}
                className="cursor-pointer bg-brand-bg dark:bg-brandDark-bg rounded-xl p-4 border border-brand-border dark:border-brandDark-border transition-all duration-300 hover:shadow-md hover:border-brand-primary/30 group"
              >
                <div className="text-2xl font-bold text-brand-text dark:text-brandDark-text mb-1 group-hover:text-brand-primary transition-colors">
                  {following.length}
                </div>
                <div className="text-sm text-brand-muted dark:text-brandDark-muted capitalize flex items-center gap-2">
                  Following <FiUsers />
                </div>
              </div>

              {/* Existing Stats */}
              {Object.entries(stats).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-brand-bg dark:bg-brandDark-bg rounded-xl p-4 border border-brand-border dark:border-brandDark-border transition-colors duration-300 hover:shadow-md"
                >
                  <div className="text-2xl font-bold text-brand-text dark:text-brandDark-text mb-1">
                    {value}
                  </div>
                  <div className="text-sm text-brand-muted dark:text-brandDark-muted capitalize">
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-3 mb-8 overflow-x-auto pb-3">
        {[
          { id: "posts", label: "Posts", count: stats.posts },
          { id: "comments", label: "Comments", count: stats.comments },
          { id: "replies", label: "Replies", count: stats.replies },
          { id: "contributions", label: "Contributions", count: stats.contributions }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
              ? "bg-gradient-to-r from-brand-primary to-brand-primaryHover text-white shadow-lg"
              : "bg-brand-surface dark:bg-brandDark-surface text-brand-text dark:text-brandDark-text hover:bg-brand-bg dark:hover:bg-brandDark-bg border border-brand-border dark:border-brandDark-border hover:shadow-md"
              }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id
                ? "bg-white/20"
                : "bg-brand-bg dark:bg-brandDark-bg"
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-brand-surface dark:bg-brandDark-surface rounded-2xl shadow-soft overflow-hidden transition-colors duration-300">
        {renderContent()}
      </div>

      <UserListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
        users={followers}
        isLoading={loadingFollows}
      />

      <UserListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
        users={following}
        isLoading={loadingFollows}
      />
    </div >
  );
};

export default ProfilePage;