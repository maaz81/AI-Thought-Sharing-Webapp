import React, { useEffect, useState } from "react";
import axios from 'axios'; // ✅ Missing import
import ProfilePost from "./ProfilePost";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState(null); // ✅ Add user data state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/profile/', {
          withCredentials: true,
        });
        const data = res.data;
        setUserData(data); // ✅ Store the data
      } catch (error) {
        console.log('Error fetching user profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts(); // ✅ Call the function
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePost />;
      case "comments":
        return <div>Your Comments will appear here...</div>;
      case "replies":
        return <div>Your Replies will appear here...</div>;
      case "contributions":
        return <div>Your Contributions will appear here...</div>;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center py-10">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-gray-600">
          Welcome back, {userData?.username || "User"}!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b pb-2 mb-4 overflow-x-auto">
        {["posts", "comments", "replies", "contributions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-4 rounded shadow">{renderContent()}</div>
    </div>
  );
};

export default ProfilePage;
