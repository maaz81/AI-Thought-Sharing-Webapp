import React, { useState, useMemo } from 'react';

const Moderation = () => {
  // Existing state
  const [reportedPosts, setReportedPosts] = useState([
    {
      id: 1,
      title: "Sample Post 1",
      reportCount: 5,
      topReason: "Spam",
      author: "user123",
      status: "pending"
    },
    {
      id: 2,
      title: "Sample Post 2", 
      reportCount: 3,
      topReason: "Hate Speech",
      author: "user456",
      status: "pending"
    }
  ]);

  const [aiFlaggedPosts, setAiFlaggedPosts] = useState([
    {
      id: 101,
      title: "AI Flagged Post 1",
      flagType: "Hate Speech",
      confidence: 0.92,
      author: "user789",
      status: "pending"
    },
    {
      id: 102,
      title: "AI Flagged Post 2",
      flagType: "Spam",
      confidence: 0.78,
      author: "user101",
      status: "pending"
    }
  ]);

  // New state for enhanced features
  const [activeTab, setActiveTab] = useState('reported');
  const [selectedAiPosts, setSelectedAiPosts] = useState([]);
  const [confidenceFilter, setConfidenceFilter] = useState(0.7);
  const [moderationLog, setModerationLog] = useState([
    { id: 1, action: "Post 'Sample Post 1' reviewed", admin: "Admin User", timestamp: new Date().toISOString() },
    { id: 2, action: "User user123 warned", admin: "Admin User", timestamp: new Date(Date.now() - 3600000).toISOString() }
  ]);
  const [showUserHistory, setShowUserHistory] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter AI posts by confidence
  const filteredAiPosts = useMemo(() => {
    return aiFlaggedPosts.filter(post => post.confidence >= confidenceFilter);
  }, [aiFlaggedPosts, confidenceFilter]);

  // Mock flag statistics
  const flagStats = {
    "Hate Speech": 12,
    "Spam": 8,
    "Harassment": 5,
    "Inappropriate": 3
  };

  // Enhanced action handlers with toast simulation
  const handleAction = (action, post, message) => {
    // Simulate API call
    setTimeout(() => {
      // Show toast notification
      alert(`✅ ${message}`);
      
      // Add to audit log
      const logEntry = {
        id: moderationLog.length + 1,
        action: `${action}: ${post.title}`,
        admin: "Admin User", 
        timestamp: new Date().toISOString()
      };
      setModerationLog(prev => [logEntry, ...prev]);
    }, 500);
  };

  const handleReview = (post) => {
    handleAction("Reviewed", post, "Post marked for review");
  };

  const handleDismiss = (post) => {
    handleAction("Dismissed", post, "Report dismissed");
  };

  const handleWarnUser = (post) => {
    setSelectedUser(post.author);
    setShowUserHistory(true);
    handleAction("Warned User", post, `Warning sent to ${post.author}`);
  };

  const handleDelete = (post) => {
    handleAction("Deleted", post, "Post deleted successfully");
  };

  const handleAcceptAI = (post) => {
    handleAction("AI Flag Accepted", post, "AI flag accepted - post removed");
  };

  const handleOverride = (post) => {
    handleAction("AI Flag Overridden", post, "AI flag overridden - post restored");
  };

  // Bulk action handlers
  const handleBulkAccept = () => {
    selectedAiPosts.forEach(postId => {
      const post = aiFlaggedPosts.find(p => p.id === postId);
      if (post) handleAcceptAI(post);
    });
    setSelectedAiPosts([]);
  };

  const handleBulkDismiss = () => {
    selectedAiPosts.forEach(postId => {
      const post = aiFlaggedPosts.find(p => p.id === postId);
      if (post) handleOverride(post);
    });
    setSelectedAiPosts([]);
  };

  const toggleAiPostSelection = (postId) => {
    setSelectedAiPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleBanUser = (userId, duration) => {
    const action = duration === 'permanent' ? 'Permanently banned' : `Banned for ${duration}`;
    handleAction(action, { title: `User ${userId}` }, `${action} user ${userId}`);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", label: "Pending" },
      resolved: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", label: "Resolved" },
      reviewing: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", label: "Under Review" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Confidence badge component
  const ConfidenceBadge = ({ confidence }) => {
    const getColor = (conf) => {
      if (conf >= 0.9) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      if (conf >= 0.7) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor(confidence)}`}>
        {Math.round(confidence * 100)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Content Moderation Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage reported content and AI-flagged posts with advanced moderation tools
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'reported', name: 'Reported Posts', count: reportedPosts.length },
              { id: 'ai-flagged', name: 'AI Flagged', count: aiFlaggedPosts.length },
              { id: 'analytics', name: 'Analytics', count: null },
              { id: 'audit-log', name: 'Audit Log', count: moderationLog.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className="ml-2 py-0.5 px-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Reported Posts Tab */}
      {activeTab === 'reported' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reported Content
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage user-reported posts and take appropriate actions
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        {post.reportCount} reports
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.topReason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedUser(post.author);
                          setShowUserHistory(true);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        aria-label={`View ${post.author} profile`}
                      >
                        {post.author}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleReview(post)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label="Review post"
                      >
                        👁️ Review
                      </button>
                      <button
                        onClick={() => handleDismiss(post)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        aria-label="Dismiss report"
                      >
                        ✅ Dismiss
                      </button>
                      <button
                        onClick={() => handleWarnUser(post)}
                        className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                        aria-label="Warn user"
                      >
                        ⚠️ Warn
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        aria-label="Delete post"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Flagged Content Tab */}
      {activeTab === 'ai-flagged' && (
        <div className="space-y-6">
          {/* AI Controls Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  AI Flagged Content
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Review posts flagged by AI moderation system
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Confidence Filter */}
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confidence: ≥{Math.round(confidenceFilter * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={confidenceFilter}
                    onChange={(e) => setConfidenceFilter(parseFloat(e.target.value))}
                    className="w-32"
                  />
                </div>

                {/* Bulk Actions */}
                {selectedAiPosts.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleBulkAccept}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                    >
                      Accept Selected ({selectedAiPosts.length})
                    </button>
                    <button
                      onClick={handleBulkDismiss}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                      Dismiss Selected ({selectedAiPosts.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Flag Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(flagStats).map(([type, count]) => (
              <div key={type} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{type}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
              </div>
            ))}
          </div>

          {/* AI Flagged Posts Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Flag Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAiPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedAiPosts.includes(post.id)}
                          onChange={() => toggleAiPostSelection(post.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          {post.flagType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ConfidenceBadge confidence={post.confidence} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleAcceptAI(post)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="Accept AI flag"
                        >
                          ✅ Accept AI
                        </button>
                        <button
                          onClick={() => handleOverride(post)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          aria-label="Override AI flag"
                        >
                          ↩️ Override
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Moderation Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">42</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Posts Moderated Today</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">87%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Accuracy Rate</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">15 min</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">92%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">User Satisfaction</div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit-log' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Moderation Audit Log
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete history of all moderation actions
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {moderationLog.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.admin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User History Modal */}
      {showUserHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User History: {selectedUser}
                </h3>
                <button
                  onClick={() => setShowUserHistory(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                  Previous Infractions
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>• 2024-01-15: Warning for spam content</li>
                  <li>• 2024-01-08: Post removed for inappropriate content</li>
                  <li>• 2024-01-02: Warning for hate speech</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                  Ban User
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['1 day', '1 week', '1 month', 'permanent'].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => handleBanUser(selectedUser, duration)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Ban {duration}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Send Notification
                </h4>
                <button
                  onClick={() => alert(`Notification sent to ${selectedUser}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  📧 Send Warning Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moderation;