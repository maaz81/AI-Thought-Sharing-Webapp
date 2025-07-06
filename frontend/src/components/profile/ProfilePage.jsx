import React, { useState } from "react";
import ProfilePost from "./ProfilePost";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePost/>
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-gray-600">Welcome back, Maaz!</p>
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
      <div className="bg-white p-4 rounded shadow">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;
