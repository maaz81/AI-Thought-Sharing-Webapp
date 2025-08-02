import React, { use, useEffect, useState } from "react";
import axios from 'axios';
import { FiUser, FiMessageSquare, FiCornerUpLeft, FiStar, FiLoader } from "react-icons/fi";
import ProfilePost from "./ProfilePost";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState(null);
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
        const [profileRes, statsRes, userDataDetails] = await Promise.all([
          axios.get('http://localhost:5000/profile/', { withCredentials: true }),
          axios.get('http://localhost:5000/profile/stats', { withCredentials: true }),
          axios.get('http://localhost:5000/api/profile/details', { withCredentials: true })
        ]);

        setUserData(profileRes.data);
        setUserDetails(userDataDetails.data);
        setStats(statsRes.data)
        

      } catch (error) {
        console.error('Error fetching profile data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex items-end -mt-16 mb-4">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                <button onClick={() => navigate('/profile/update')}>
                  {userDetails ? (
                    <img
                       src={`http://localhost:5000/uploads/${userDetails.basic_info.photo}`}
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
              <h1 className="text-2xl mb-2 font-bold text-gray-900">
                {userData?.username || "User"}

              </h1>
              <p className="text-gray-600 mb-1">{userData?.bio || "No bio yet"}</p>

            </div>
            <button
              onClick={() => navigate('/profile/update')}
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all"
            >
              Update Profile
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { name: 'Posts', value: stats.posts, icon: <FiUser className="text-blue-500" /> },
              { name: 'Comments', value: stats.comments, icon: <FiMessageSquare className="text-green-500" /> },
              { name: 'Replies', value: stats.replies, icon: <FiCornerUpLeft className="text-purple-500" /> },
              { name: 'Contributions', value: stats.contributions, icon: <FiStar className="text-yellow-500" /> }
            ].map((stat) => (
              <div
                key={stat.name}
                onClick={() => setActiveTab(stat.name.toLowerCase())}
                className={`bg-gray-50 rounded-lg p-4 text-center cursor-pointer transition-all hover:shadow-md ${activeTab === stat.name.toLowerCase() ? 'ring-2 ring-blue-400' : ''
                  }`}
              >
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {["posts", "comments", "replies", "contributions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
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