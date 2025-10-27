import React, { useState, useMemo } from 'react';
import Sidebar from '../dashboard/Sidebar';

const AiFlagged = () => {
  const [aiFlaggedPosts, setAiFlaggedPosts] = useState([
    {
      id: 101,
      title: "AI Flagged Post 1",
      content: "This is the content of the first flagged post that needs review...",
      flagType: "Hate Speech",
      confidence: 0.92,
      author: "user789",
      status: "pending",
      timestamp: "2024-01-15T14:30:00Z",
      severity: "high"
    },
    {
      id: 102,
      title: "AI Flagged Post 2",
      content: "This post contains potential spam content that requires moderation...",
      flagType: "Spam",
      confidence: 0.78,
      author: "user101",
      status: "pending",
      timestamp: "2024-01-15T13:45:00Z",
      severity: "medium"
    },
    {
      id: 103,
      title: "Questionable Content Post",
      content: "This content might be inappropriate for our platform...",
      flagType: "Inappropriate",
      confidence: 0.65,
      author: "user202",
      status: "pending",
      timestamp: "2024-01-15T12:20:00Z",
      severity: "low"
    }
  ]);

  const [selectedAiPosts, setSelectedAiPosts] = useState([]);
  const [confidenceFilter, setConfidenceFilter] = useState(0.7);
  const [moderationLog, setModerationLog] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlagTypes, setSelectedFlagTypes] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [expandedPost, setExpandedPost] = useState(null);

  const flagTypes = ["Hate Speech", "Spam", "Harassment", "Inappropriate"];
  const severityLevels = [
    { value: "high", label: "High", color: "bg-red-500" },
    { value: "medium", label: "Medium", color: "bg-orange-500" },
    { value: "low", label: "Low", color: "bg-yellow-500" }
  ];

  const filteredAiPosts = useMemo(() => {
    return aiFlaggedPosts.filter(post => {
      const matchesConfidence = post.confidence >= confidenceFilter;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFlagType = selectedFlagTypes.length === 0 ||
        selectedFlagTypes.includes(post.flagType);
      const matchesSeverity = selectedSeverity === "all" ||
        post.severity === selectedSeverity;

      return matchesConfidence && matchesSearch && matchesFlagType && matchesSeverity;
    });
  }, [aiFlaggedPosts, confidenceFilter, searchTerm, selectedFlagTypes, selectedSeverity]);

  const flagStats = useMemo(() => {
    const stats = {
      "Hate Speech": 0,
      "Spam": 0,
      "Harassment": 0,
      "Inappropriate": 0
    };

    aiFlaggedPosts.forEach(post => {
      if (stats.hasOwnProperty(post.flagType)) {
        stats[post.flagType]++;
      }
    });

    return stats;
  }, [aiFlaggedPosts]);

  const handleAction = (action, post, message) => {
    setTimeout(() => {
      // Remove post from the list
      setAiFlaggedPosts(prev => prev.filter(p => p.id !== post.id));

      const logEntry = {
        id: moderationLog.length + 1,
        action: `${action}: ${post.title}`,
        admin: "Admin User",
        timestamp: new Date().toISOString(),
        postId: post.id,
        flagType: post.flagType
      };

      setModerationLog(prev => [logEntry, ...prev.slice(0, 49)]); // Keep only last 50 entries
    }, 500);
  };

  const handleAcceptAI = (post) => {
    handleAction("AI Flag Accepted", post, "AI flag accepted - post removed");
  };

  const handleOverride = (post) => {
    handleAction("AI Flag Overridden", post, "AI flag overridden - post restored");
  };

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

  const toggleFlagType = (flagType) => {
    setSelectedFlagTypes(prev =>
      prev.includes(flagType)
        ? prev.filter(type => type !== flagType)
        : [...prev, flagType]
    );
  };

  const selectAllPosts = () => {
    setSelectedAiPosts(filteredAiPosts.map(post => post.id));
  };

  const clearSelection = () => {
    setSelectedAiPosts([]);
  };

  const ConfidenceBadge = ({ confidence }) => {
    const getColor = (conf) => {
      if (conf >= 0.9) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200";
      if (conf >= 0.7) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200";
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200";
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getColor(confidence)}`}>
        <span className="w-2 h-2 rounded-full bg-current mr-2 opacity-70"></span>
        {Math.round(confidence * 100)}% Confident
      </span>
    );
  };

  const SeverityBadge = ({ severity }) => {
    const severityConfig = severityLevels.find(s => s.value === severity);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${severityConfig?.color}`}>
        {severityConfig?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
        <div className="flex justify-center bg-gray-100 dark:bg-gray-900 min-h-screen">

      <div className="space-y-6 p-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    AI Content Moderation
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Review and manage posts flagged by AI moderation system
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "table"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "card"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  Cards
                </button>
              </div>

              {/* Confidence Filter */}
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow-sm">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Confidence: ≥{Math.round(confidenceFilter * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(parseFloat(e.target.value))}
                  className="w-32 accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Filters Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Statistics */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(flagStats).map(([type, count]) => (
              <div key={type} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{type}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(count / Math.max(...Object.values(flagStats))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={selectAllPosts}
                disabled={filteredAiPosts.length === 0}
                className="w-full px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
              >
                Select All ({filteredAiPosts.length})
              </button>
              <button
                onClick={clearSelection}
                disabled={selectedAiPosts.length === 0}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search posts, content, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Flag Type Filter */}
            <div className="flex flex-wrap gap-2">
              {flagTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleFlagType(type)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedFlagTypes.includes(type)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severity</option>
              {severityLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label} Severity</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAiPosts.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  {selectedAiPosts.length} post{selectedAiPosts.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkAccept}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Accept Flags ({selectedAiPosts.length})
                </button>
                <button
                  onClick={handleBulkDismiss}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Dismiss Flags ({selectedAiPosts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {viewMode === "table" ? (
          /* Table View */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedAiPosts.length === filteredAiPosts.length && filteredAiPosts.length > 0}
                        onChange={() => selectedAiPosts.length === filteredAiPosts.length ? clearSelection() : selectAllPosts()}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Post Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Flag Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAiPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedAiPosts.includes(post.id)}
                          onChange={() => toggleAiPostSelection(post.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {post.content}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDate(post.timestamp)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            {post.flagType}
                          </span>
                          <ConfidenceBadge confidence={post.confidence} />
                          <SeverityBadge severity={post.severity} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{post.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAcceptAI(post)}
                            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Accept Flag
                          </button>
                          <button
                            onClick={() => handleOverride(post)}
                            className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Dismiss Flag
                          </button>
                          <button
                            onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {expandedPost === post.id ? 'Hide' : 'View'} Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAiPosts.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No flagged posts found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAiPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          {post.flagType}
                        </span>
                        <SeverityBadge severity={post.severity} />
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedAiPosts.includes(post.id)}
                      onChange={() => toggleAiPostSelection(post.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                  </div>

                  {/* Content Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {post.content}
                    </p>
                  </div>

                  {/* Confidence Meter */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>AI Confidence</span>
                      <span className="font-medium">{Math.round(post.confidence * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${post.confidence >= 0.9 ? 'bg-red-500' :
                            post.confidence >= 0.7 ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}
                        style={{ width: `${post.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>By {post.author}</span>
                    <span>{formatDate(post.timestamp)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptAI(post)}
                      className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Accept
                    </button>
                    <button
                      onClick={() => handleOverride(post)}
                      className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredAiPosts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No flagged posts found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>

  );
};

export default AiFlagged;