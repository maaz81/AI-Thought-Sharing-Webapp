// Audit.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Trash2,
  Edit,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import Sidebar from '../dashboard/Sidebar';

// Mock data for audit logs
const mockAuditLogs = [
  // Admin Actions
  {
    id: 1,
    type: 'admin_action',
    action: 'delete_post',
    adminName: 'Sarah Wilson',
    adminRole: 'super_admin',
    targetUser: 'john_doe',
    targetType: 'post',
    description: 'Deleted inappropriate post containing prohibited content',
    timestamp: new Date('2024-01-15T14:30:00Z'),
    severity: 'warning',
    details: {
      postId: 'post_12345',
      reason: 'Violation of community guidelines',
      contentPreview: 'This is a preview of the deleted post...'
    }
  },
  {
    id: 2,
    type: 'admin_action',
    action: 'ban_user',
    adminName: 'Mike Chen',
    adminRole: 'moderator',
    targetUser: 'spam_account',
    targetType: 'user',
    description: 'Permanently banned user for repeated violations',
    timestamp: new Date('2024-01-15T12:15:00Z'),
    severity: 'error',
    details: {
      userId: 'user_67890',
      banReason: 'Spamming and fake accounts',
      duration: 'permanent'
    }
  },
  {
    id: 3,
    type: 'admin_action',
    action: 'edit_content',
    adminName: 'Sarah Wilson',
    adminRole: 'super_admin',
    targetUser: 'ai_enthusiast',
    targetType: 'post',
    description: 'Edited post title for clarity and SEO optimization',
    timestamp: new Date('2024-01-15T10:45:00Z'),
    severity: 'info',
    details: {
      postId: 'post_45678',
      changes: ['Title updated from "AI Stuff" to "Advanced Neural Networks Explained"'],
      reason: 'SEO optimization'
    }
  },

  // User Changes
  {
    id: 4,
    type: 'user_change',
    action: 'role_update',
    adminName: 'Alex Rivera',
    adminRole: 'super_admin',
    targetUser: 'tech_writer',
    targetType: 'user',
    description: 'Changed user role from Member → Moderator',
    timestamp: new Date('2024-01-15T09:20:00Z'),
    severity: 'info',
    details: {
      previousRole: 'member',
      newRole: 'moderator',
      reason: 'Promoted for consistent quality contributions'
    }
  },
  {
    id: 5,
    type: 'user_change',
    action: 'profile_update',
    adminName: 'System',
    adminRole: 'system',
    targetUser: 'jane_smith',
    targetType: 'user',
    description: 'User updated profile information and avatar',
    timestamp: new Date('2024-01-15T08:10:00Z'),
    severity: 'info',
    details: {
      updatedFields: ['avatar', 'bio'],
      autoApproved: true
    }
  },

  // System Events
  {
    id: 6,
    type: 'system_event',
    action: 'auto_moderation',
    adminName: 'AI System',
    adminRole: 'system',
    targetUser: 'new_user_123',
    targetType: 'post',
    description: 'Auto-flagged post for review: Potential hate speech detected',
    timestamp: new Date('2024-01-15T07:30:00Z'),
    severity: 'warning',
    details: {
      detectionType: 'hate_speech',
      confidence: 0.92,
      actionTaken: 'flagged_for_review'
    }
  },
  {
    id: 7,
    type: 'system_event',
    action: 'model_update',
    adminName: 'AI System',
    adminRole: 'system',
    targetUser: null,
    targetType: 'system',
    description: 'Updated AI content moderation model to v2.3.1',
    timestamp: new Date('2024-01-15T06:00:00Z'),
    severity: 'info',
    details: {
      version: '2.3.1',
      improvements: ['Better context understanding', 'Reduced false positives'],
      deploymentTime: '15 minutes'
    }
  },
  {
    id: 8,
    type: 'system_event',
    action: 'server_error',
    adminName: 'System',
    adminRole: 'system',
    targetUser: null,
    targetType: 'system',
    description: 'Database connection timeout - resolved automatically',
    timestamp: new Date('2024-01-15T05:45:00Z'),
    severity: 'error',
    details: {
      errorCode: 'DB_CONN_TIMEOUT',
      duration: '45 seconds',
      affectedServices: ['User Authentication', 'Post Feed']
    }
  },
  {
    id: 9,
    type: 'admin_action',
    action: 'login',
    adminName: 'Sarah Wilson',
    adminRole: 'super_admin',
    targetUser: null,
    targetType: 'system',
    description: 'Admin logged in from new device',
    timestamp: new Date('2024-01-15T14:00:00Z'),
    severity: 'info',
    details: {
      device: 'Chrome on Windows',
      location: 'New York, US',
      twoFactor: true
    }
  },
  {
    id: 10,
    type: 'user_change',
    action: 'privilege_update',
    adminName: 'Mike Chen',
    adminRole: 'moderator',
    targetUser: 'content_creator',
    targetType: 'user',
    description: 'Granted premium content creation privileges',
    timestamp: new Date('2024-01-14T16:20:00Z'),
    severity: 'info',
    details: {
      privilegesAdded: ['Extended post length', 'Advanced formatting', 'Priority support'],
      expires: '2024-04-14'
    }
  }
];

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    default:
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
  }
};

const getActionIcon = (action) => {
  switch (action) {
    case 'delete_post':
    case 'ban_user':
      return <Trash2 className="w-4 h-4" />;
    case 'edit_content':
      return <Edit className="w-4 h-4" />;
    case 'role_update':
    case 'privilege_update':
      return <Shield className="w-4 h-4" />;
    case 'login':
      return <User className="w-4 h-4" />;
    case 'auto_moderation':
    case 'model_update':
      return <RefreshCw className="w-4 h-4" />;
    default:
      return <MoreHorizontal className="w-4 h-4" />;
  }
};

const Audit = () => {
  // State management
  const [logs, setLogs] = useState(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    action: 'all',
    severity: 'all',
    dateRange: 'all'
  });
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and search logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        searchTerm === '' ||
        log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.targetUser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.type === 'all' || log.type === filters.type;
      const matchesAction = filters.action === 'all' || log.action === filters.action;
      const matchesSeverity = filters.severity === 'all' || log.severity === filters.severity;

      return matchesSearch && matchesType && matchesAction && matchesSeverity;
    });
  }, [logs, searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        // In a real app, this would fetch new logs from the API
        console.log('Auto-refreshing logs...');
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      type: 'all',
      action: 'all',
      severity: 'all',
      dateRange: 'all'
    });
    setCurrentPage(1);
  };

  const toggleExpandLog = (logId) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ['ID', 'Type', 'Action', 'Admin', 'Target', 'Description', 'Timestamp', 'Severity'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.id,
        log.type,
        log.action,
        log.adminName,
        log.targetUser || 'N/A',
        `"${log.description}"`,
        log.timestamp.toISOString(),
        log.severity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // In a real implementation, you would use a library like jsPDF
    alert('PDF export functionality would be implemented with a library like jsPDF');
    console.log('Exporting to PDF:', filteredLogs);
  };

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Audit Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor system activity, user changes, and administrative actions
          </p>
        </div>

        {/* Controls Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs by admin, user, or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="admin_action">Admin Actions</option>
                <option value="user_change">User Changes</option>
                <option value="system_event">System Events</option>
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Action Type
              </label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Actions</option>
                <option value="delete_post">Delete Post</option>
                <option value="ban_user">Ban User</option>
                <option value="edit_content">Edit Content</option>
                <option value="role_update">Role Update</option>
                <option value="auto_moderation">Auto Moderation</option>
                <option value="login">Login</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Auto-refresh Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  autoRefresh
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Admin / System
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Target & Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {paginatedLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => toggleExpandLog(log.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getSeverityIcon(log.severity)}
                          {getActionIcon(log.action)}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {log.action.replace('_', ' ')}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {log.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.adminName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {log.adminRole.replace('_', ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.targetUser ? `@${log.targetUser}` : 'System'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {log.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandLog(log.id);
                          }}
                          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                          {expandedLogs.has(log.id) ? 'Hide' : 'View'}
                          {expandedLogs.has(log.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    {expandedLogs.has(log.id) && (
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Additional Details
                            </h4>
                            <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No logs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters to see more results.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;