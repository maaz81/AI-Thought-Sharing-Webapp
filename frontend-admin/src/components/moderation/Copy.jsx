import React, { useState, useEffect, useMemo } from 'react';

// Enhanced StatusBadge with more status options and better styling
const StatusBadge = ({ status }) => {
  const colorMap = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    reviewed: 'bg-green-100 text-green-800 border border-green-200',
    deleted: 'bg-red-100 text-red-800 border border-red-200',
    in_review: 'bg-blue-100 text-blue-800 border border-blue-200',
    appealed: 'bg-purple-100 text-purple-800 border border-purple-200',
  };
  
  const statusLabels = {
    pending: 'Pending Review',
    reviewed: 'Reviewed',
    deleted: 'Deleted',
    in_review: 'In Review',
    appealed: 'Appealed'
  };

  return (
    <span
      className={`px-3 py-1.5 text-xs font-medium rounded-full ${colorMap[status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}
    >
      {statusLabels[status] || status}
    </span>
  );
};

// Priority indicator component
const PriorityBadge = ({ priority }) => {
  const priorityMap = {
    high: 'bg-red-100 text-red-800 border border-red-200',
    medium: 'bg-orange-100 text-orange-800 border border-orange-200',
    low: 'bg-gray-100 text-gray-800 border border-gray-200',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${priorityMap[priority] || 'bg-gray-100 text-gray-700'}`}
    >
      {priority?.toUpperCase() || 'LOW'}
    </span>
  );
};

// Filter component for better data management
const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in_review">In Review</option>
        <option value="reviewed">Reviewed</option>
        <option value="deleted">Deleted</option>
        <option value="appealed">Appealed</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => onFilterChange('priority', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <input
        type="text"
        placeholder="Search posts or users..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex-1 min-w-[200px]"
      />
    </div>
  );
};

// Statistics Cards Component
const StatsOverview = ({ reports }) => {
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const inReview = reports.filter(r => r.status === 'in_review').length;
    const highPriority = reports.filter(r => r.priority === 'high').length;

    return { total, pending, inReview, highPriority };
  }, [reports]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <span className="text-blue-600 dark:text-blue-400">📊</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <span className="text-yellow-600 dark:text-yellow-400">⏰</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Review</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inReview}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <span className="text-blue-600 dark:text-blue-400">👁️</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.highPriority}</p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <span className="text-red-600 dark:text-red-400">🚨</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bulk Actions Component
const BulkActions = ({ selectedItems, onBulkAction }) => {
  if (selectedItems.length === 0) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onBulkAction('review')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Mark as Reviewed
          </button>
          <button
            onClick={() => onBulkAction('delete')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Delete Selected
          </button>
          <button
            onClick={() => onBulkAction('dismiss')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Dismiss Reports
          </button>
        </div>
      </div>
    </div>
  );
};

const Moderation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reportedPosts, setReportedPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced dummy data with more realistic fields
  useEffect(() => {
    const loadDummyData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyReports = [
        {
          id: 'POST-001',
          reason: 'Inappropriate language in comments',
          reportCount: 5,
          status: 'pending',
          userId: 'USER-1001',
          userName: 'john_doe',
          content: 'This is some sample content that was reported...',
          timestamp: '2024-01-15T10:30:00Z',
          priority: 'high',
          category: 'harassment',
          reporterCount: 3
        },
        {
          id: 'POST-002',
          reason: 'Spam or misleading content',
          reportCount: 3,
          status: 'reviewed',
          userId: 'USER-1002',
          userName: 'jane_smith',
          content: 'Check out this amazing offer!!!',
          timestamp: '2024-01-14T15:45:00Z',
          priority: 'medium',
          category: 'spam',
          reporterCount: 2
        },
        {
          id: 'POST-003',
          reason: 'Hate speech or harassment',
          reportCount: 8,
          status: 'in_review',
          userId: 'USER-1003',
          userName: 'bob_wilson',
          content: 'Offensive comments targeting specific group...',
          timestamp: '2024-01-15T09:15:00Z',
          priority: 'high',
          category: 'hate_speech',
          reporterCount: 5
        },
        {
          id: 'POST-004',
          reason: 'Graphic or violent content',
          reportCount: 2,
          status: 'deleted',
          userId: 'USER-1004',
          userName: 'alice_brown',
          content: '[Content deleted by moderator]',
          timestamp: '2024-01-13T14:20:00Z',
          priority: 'medium',
          category: 'violence',
          reporterCount: 1
        },
        {
          id: 'POST-005',
          reason: 'Copyright infringement',
          reportCount: 4,
          status: 'appealed',
          userId: 'USER-1005',
          userName: 'charlie_green',
          content: 'Shared copyrighted material without permission...',
          timestamp: '2024-01-15T11:00:00Z',
          priority: 'medium',
          category: 'copyright',
          reporterCount: 2
        },
      ];
      
      setReportedPosts(dummyReports);
      setIsLoading(false);
    };

    loadDummyData();
  }, []);

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    return reportedPosts.filter(post => {
      const matchesStatus = filters.status === 'all' || post.status === filters.status;
      const matchesPriority = filters.priority === 'all' || post.priority === filters.priority;
      const matchesSearch = filters.search === '' || 
        post.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.reason.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.userName.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [reportedPosts, filters]);

  // Enhanced event handlers with state updates
  const handleReview = (post) => {
    console.log('Reviewing post:', post);
    setReportedPosts(prev => 
      prev.map(p => p.id === post.id ? { ...p, status: 'reviewed' } : p)
    );
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      newSet.delete(post.id);
      return newSet;
    });
  };

  const handleDismiss = (id) => {
    console.log('Dismiss report for:', id);
    setReportedPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleWarnUser = (userId) => {
    console.log('Warn user:', userId);
    // In a real app, this would trigger a warning system
  };

  const handleDelete = (id) => {
    console.log('Delete post:', id);
    setReportedPosts(prev => 
      prev.map(p => p.id === id ? { ...p, status: 'deleted' } : p)
    );
  };

  const handleSelectPost = (id) => {
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filteredPosts.map(post => post.id)));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'review':
        setReportedPosts(prev => 
          prev.map(p => selectedPosts.has(p.id) ? { ...p, status: 'reviewed' } : p)
        );
        break;
      case 'delete':
        setReportedPosts(prev => 
          prev.map(p => selectedPosts.has(p.id) ? { ...p, status: 'deleted' } : p)
        );
        break;
      case 'dismiss':
        setReportedPosts(prev => 
          prev.filter(p => !selectedPosts.has(p.id))
        );
        break;
    }
    setSelectedPosts(new Set());
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Content Moderation</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and review reported content across the platform
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Export Reports
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              New Moderation Rule
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 px-6">
            {['overview', 'reported'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <StatsOverview reports={reportedPosts} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {reportedPosts.slice(0, 3).map(post => (
                        <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <StatusBadge status={post.status} />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {post.id}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {post.reason}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(post.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                        <div className="text-lg font-semibold">
                          {reportedPosts.filter(p => p.status === 'pending').length}
                        </div>
                        <div className="text-sm">Pending Review</div>
                      </button>
                      <button className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        <div className="text-lg font-semibold">
                          {reportedPosts.filter(p => p.priority === 'high').length}
                        </div>
                        <div className="text-sm">High Priority</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reported Posts Tab */}
            {activeTab === 'reported' && (
              <div className="space-y-6">
                <FilterBar filters={filters} onFilterChange={handleFilterChange} />
                
                <BulkActions 
                  selectedItems={Array.from(selectedPosts)} 
                  onBulkAction={handleBulkAction}
                />

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Loading reports...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No reports found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th className="w-12 px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedPosts.size === filteredPosts.length && filteredPosts.length > 0}
                                onChange={handleSelectAll}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Post Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Reports
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Status & Priority
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredPosts.map((post) => (
                            <tr
                              key={post.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedPosts.has(post.id)}
                                  onChange={() => handleSelectPost(post.id)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {post.id}
                                      </p>
                                      <PriorityBadge priority={post.priority} />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                      {post.reason}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      By {post.userName} ({post.userId})
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                      {post.content}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-center">
                                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {post.reportCount}
                                  </span>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    reports
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-2">
                                  <StatusBadge status={post.status} />
                                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {post.category?.replace('_', ' ')}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(post.timestamp)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleReview(post)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                                  >
                                    Review
                                  </button>
                                  <button
                                    onClick={() => handleWarnUser(post.userId)}
                                    className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded-lg transition-colors"
                                  >
                                    Warn
                                  </button>
                                  <button
                                    onClick={() => handleDelete(post.id)}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Moderation;