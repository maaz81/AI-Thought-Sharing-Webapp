import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Mail, 
  Smartphone, 
  Edit, 
  Trash2, 
  Eye,
  Send,
  ToggleLeft,
  ToggleRight,
  Filter,
  Search,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react';

const Notifications = () => {
  // Mock data states
  const [systemNotifications, setSystemNotifications] = useState([
    {
      id: 1,
      title: 'Platform Maintenance',
      message: 'Scheduled maintenance this weekend',
      type: 'warning',
      createdAt: '2024-01-15',
      isActive: true
    },
    {
      id: 2,
      title: 'New AI Features',
      message: 'Enhanced thought generation capabilities',
      type: 'update',
      createdAt: '2024-01-10',
      isActive: true
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Performance improvements deployed',
      type: 'info',
      createdAt: '2024-01-05',
      isActive: false
    }
  ]);

  const [userTemplates, setUserTemplates] = useState([
    {
      id: 1,
      name: 'New Post Published',
      channel: 'both',
      subject: 'Your post is live!',
      message: 'Your thought has been published successfully.',
      enabled: true
    },
    {
      id: 2,
      name: 'Post Liked',
      channel: 'push',
      subject: 'Someone liked your post',
      message: 'Your thought received a new like!',
      enabled: true
    },
    {
      id: 3,
      name: 'Report Acknowledgement',
      channel: 'email',
      subject: 'Report Received',
      message: 'We have received your report and will review it shortly.',
      enabled: false
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      name: 'Server Down',
      description: 'Web server is not responding',
      method: 'email',
      severity: 'critical',
      enabled: true
    },
    {
      id: 2,
      name: 'Backup Failure',
      description: 'Database backup failed',
      method: 'dashboard',
      severity: 'high',
      enabled: true
    },
    {
      id: 3,
      name: 'High Error Rate',
      description: 'Increased error rate detected',
      method: 'both',
      severity: 'medium',
      enabled: false
    }
  ]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] = useState(true);

  // New notification form state
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    scheduledDate: '',
    scheduledTime: ''
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  // Color coding functions
  const getTypeBadge = (type) => {
    const styles = {
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      update: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      warning: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    const icons = {
      info: '🟢',
      update: '🟡',
      warning: '🔴'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {icons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[severity]}`}>
        {icons[severity]} {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  // Handler functions
  const handleCreateNotification = () => {
    const notification = {
      id: systemNotifications.length + 1,
      ...newNotification,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };
    setSystemNotifications([notification, ...systemNotifications]);
    setShowCreateModal(false);
    setNewNotification({ title: '', message: '', type: 'info', scheduledDate: '', scheduledTime: '' });
  };

  const handleToggleNotification = (id) => {
    setSystemNotifications(systemNotifications.map(notif =>
      notif.id === id ? { ...notif, isActive: !notif.isActive } : notif
    ));
  };

  const handleDeleteNotification = (id) => {
    setSystemNotifications(systemNotifications.filter(notif => notif.id !== id));
  };

  const handleTemplateToggle = (id) => {
    setUserTemplates(userTemplates.map(template =>
      template.id === id ? { ...template, enabled: !template.enabled } : template
    ));
  };

  const handleTemplateUpdate = (id, field, value) => {
    setUserTemplates(userTemplates.map(template =>
      template.id === id ? { ...template, [field]: value } : template
    ));
  };

  const handleAlertToggle = (id) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const handleSendTestAlert = (alertId) => {
    // Mock test alert
    alert(`Test alert sent for: ${alerts.find(a => a.id === alertId)?.name}`);
  };

  const showPreview = (template) => {
    setPreviewData(template);
    setShowPreviewModal(true);
  };

  // Filter functions
  const filteredSystemNotifications = systemNotifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const filteredUserTemplates = userTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'all' || template.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  // Statistics
  const stats = {
    totalActive: systemNotifications.filter(n => n.isActive).length,
    pendingAlerts: alerts.filter(a => a.enabled).length,
    templatesEnabled: userTemplates.filter(t => t.enabled).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-8 h-8" />
              Notifications Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage platform notifications, user templates, and alert systems
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Global Notifications</span>
              <button
                onClick={() => setGlobalNotificationsEnabled(!globalNotificationsEnabled)}
                className="relative inline-flex items-center"
              >
                {globalNotificationsEnabled ? (
                  <ToggleRight className="w-10 h-10 text-green-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Notifications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalActive}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Templates Enabled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.templatesEnabled}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pendingAlerts}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="update">Update</option>
              <option value="warning">Warning</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option value="all">All Channels</option>
              <option value="email">Email</option>
              <option value="push">Push</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* System Notifications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                System Notifications
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create New
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredSystemNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(notification.type)}
                      <button
                        onClick={() => handleToggleNotification(notification.id)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          notification.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {notification.isActive ? 'Active' : 'Archived'}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Created: {notification.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Notification Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              User Notification Templates
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {filteredUserTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => showPreview(template)}
                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleTemplateToggle(template.id)}
                        className="relative"
                      >
                        {template.enabled ? (
                          <ToggleRight className="w-8 h-8 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Channel
                      </label>
                      <select
                        value={template.channel}
                        onChange={(e) => handleTemplateUpdate(template.id, 'channel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="email">Email Only</option>
                        <option value="push">Push Only</option>
                        <option value="both">Both</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={template.subject}
                        onChange={(e) => handleTemplateUpdate(template.id, 'subject', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message
                      </label>
                      <textarea
                        value={template.message}
                        onChange={(e) => handleTemplateUpdate(template.id, 'message', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert System - Full Width */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alert System Configuration
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {alert.name}
                    </h3>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {alert.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notification Method
                      </label>
                      <select
                        value={alert.method}
                        onChange={(e) => {}}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="dashboard">Dashboard</option>
                        <option value="both">Both</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSendTestAlert(alert.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Test Alert
                      </button>
                      
                      <button
                        onClick={() => handleAlertToggle(alert.id)}
                        className="relative"
                      >
                        {alert.enabled ? (
                          <ToggleRight className="w-8 h-8 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Announcement
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter notification message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="info">Info</option>
                  <option value="update">Update</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    value={newNotification.scheduledDate}
                    onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    value={newNotification.scheduledTime}
                    onChange={(e) => setNewNotification({...newNotification, scheduledTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotification}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Preview
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {previewData.subject}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {previewData.message}
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-500">
                  {previewData.channel.includes('email') && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      Email
                    </span>
                  )}
                  {previewData.channel.includes('push') && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Smartphone className="w-3 h-3" />
                      Push
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;