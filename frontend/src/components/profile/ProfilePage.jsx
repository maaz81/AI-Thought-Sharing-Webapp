import React, { useEffect, useState } from "react";
import axios from 'axios';
import { 
  FiUser, 
  FiMessageSquare, 
  FiCornerUpLeft, 
  FiStar, 
  FiLoader, 
  FiEdit2, 
  FiLogOut 
} from "react-icons/fi";
import ProfilePost from "./ProfilePost";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    replies: 0,
    contributions: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileRes, statsRes, userPhotoRes] = await Promise.all([
          axios.get('http://localhost:5000/profile/', { withCredentials: true }),
          axios.get('http://localhost:5000/profile/stats', { withCredentials: true }),
          axios.get('http://localhost:5000/api/update/profile/userphoto', { withCredentials: true })
        ]);

        setUserData(profileRes.data);
        setStats(statsRes.data);

        const photoFilename = userPhotoRes.data;
        if (photoFilename) {
          setUserPhoto(`http://localhost:5000/uploads/${photoFilename}`);
        }

        setUserDetails(userPhotoRes.data);

      } catch (error) {
        console.error('Error fetching profile data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
          <div className="p-6 text-center text-gray-500">
            <FiMessageSquare className="mx-auto text-4xl mb-4 text-gray-300" />
            <h3 className="text-lg font-medium">Your Comments</h3>
            <p>Comments you've made on posts will appear here</p>
          </div>
        );
      case "replies":
        return (
          <div className="p-6 text-center text-gray-500">
            <FiCornerUpLeft className="mx-auto text-4xl mb-4 text-gray-300" />
            <h3 className="text-lg font-medium">Your Replies</h3>
            <p>Replies to your comments will appear here</p>
          </div>
        );
      case "contributions":
        return (
          <div className="p-6 text-center text-gray-500">
            <FiStar className="mx-auto text-4xl mb-4 text-gray-300" />
            <h3 className="text-lg font-medium">Your Contributions</h3>
            <p>Your community contributions will appear here</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <FiLoader className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 dark:text-white">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 relative">
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => navigate('/profile/update')}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all"
          >
            <FiEdit2 className="mr-1" /> Edit
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm transition-all"
          >
            <FiLogOut className="mr-1" /> Logout
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex items-end -mt-16 mb-4">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                <button onClick={() => navigate('/profile/update')}>
                  {userDetails ? (
                    <img
                      src={userPhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-4xl" />
                  )}
                </button>
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl mb-1 font-bold text-gray-900">
                {userData?.username || "User"}
              </h1>
              <p className="text-gray-600 mb-3">
                {userData?.bio || "No bio yet"}
              </p>
              
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {["posts", "comments", "replies", "contributions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;
