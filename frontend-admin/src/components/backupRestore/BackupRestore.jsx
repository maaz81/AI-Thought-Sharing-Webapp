// BackupRestore.jsx
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Download,
  Upload,
  Calendar,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Trash2,
  Play,
  MoreVertical,
  Search,
  Filter,
  Mail,
  Cloud,
  Shield,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Archive
} from 'lucide-react';
import Sidebar from '../dashboard/Sidebar';

// Mock data
const initialBackupData = {
  schedule: 'daily',
  automated: true,
  lastBackup: '2024-01-15T14:30:00Z',
  nextBackup: '2024-01-16T02:00:00Z',
  status: 'success',
  size: '2.4 GB'
};

const initialRestorePoints = [
  { id: 'RP001', date: '2024-01-15T14:30:00Z', description: 'Weekly System Backup', size: '2.4 GB', createdBy: 'admin@system.com', status: 'success' },
  { id: 'RP002', date: '2024-01-08T14:30:00Z', description: 'Weekly System Backup', size: '2.3 GB', createdBy: 'admin@system.com', status: 'success' },
  { id: 'RP003', date: '2024-01-01T14:30:00Z', description: 'New Year Backup', size: '2.2 GB', createdBy: 'admin@system.com', status: 'success' },
  { id: 'RP004', date: '2023-12-25T10:15:00Z', description: 'Christmas Special Backup', size: '2.1 GB', createdBy: 'admin@system.com', status: 'warning' },
  { id: 'RP005', date: '2023-12-18T14:30:00Z', description: 'Weekly System Backup', size: '2.0 GB', createdBy: 'admin@system.com', status: 'failed' },
];

const exportOptions = [
  { id: 'users', name: 'Users Data', description: 'Export all user accounts and profiles', icon: Users, format: ['csv', 'json', 'pdf'] },
  { id: 'posts', name: 'AI Posts', description: 'Export all AI-generated posts and content', icon: MessageSquare, format: ['csv', 'json', 'pdf'] },
  { id: 'analytics', name: 'Analytics', description: 'Export platform analytics and metrics', icon: BarChart3, format: ['csv', 'json'] },
  { id: 'logs', name: 'System Logs', description: 'Export system and moderation logs', icon: Archive, format: ['json', 'pdf'] },
];

const backupStats = {
  storageUsed: '15.2 GB',
  totalBackups: 47,
  successRate: 96,
  trends: [
    { date: 'Jan 01', success: 1, failed: 0, size: 2.1 },
    { date: 'Jan 08', success: 1, failed: 0, size: 2.3 },
    { date: 'Jan 15', success: 1, failed: 0, size: 2.4 },
    { date: 'Jan 22', success: 1, failed: 0, size: 2.5 },
  ],
  storageBreakdown: [
    { name: 'Database', value: 45, color: '#3B82F6' },
    { name: 'Media', value: 30, color: '#10B981' },
    { name: 'Logs', value: 15, color: '#F59E0B' },
    { name: 'Backups', value: 10, color: '#EF4444' },
  ]
};

const BackupRestore = () => {
  const [backupData, setBackupData] = useState(initialBackupData);
  const [restorePoints, setRestorePoints] = useState(initialRestorePoints);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRestorePoint, setSelectedRestorePoint] = useState(null);
  const [exportProgress, setExportProgress] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [cloudIntegration, setCloudIntegration] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [retentionPolicy, setRetentionPolicy] = useState(30);

  // Filter restore points based on search
  const filteredRestorePoints = restorePoints.filter(point =>
    point.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle backup schedule change
  const handleScheduleChange = (newSchedule) => {
    setBackupData(prev => ({
      ...prev,
      schedule: newSchedule,
      nextBackup: calculateNextBackup(newSchedule)
    }));
  };

  // Calculate next backup date
  const calculateNextBackup = (schedule) => {
    const now = new Date();
    switch (schedule) {
      case 'daily':
        return new Date(now.setDate(now.getDate() + 1)).toISOString();
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7)).toISOString();
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
      default:
        return 'Manual only';
    }
  };

  // Run manual backup
  const runManualBackup = () => {
    // Simulate backup process
    setBackupData(prev => ({
      ...prev,
      status: 'processing'
    }));

    setTimeout(() => {
      setBackupData(prev => ({
        ...prev,
        status: 'success',
        lastBackup: new Date().toISOString(),
        nextBackup: calculateNextBackup(prev.schedule),
        size: '2.5 GB'
      }));

      // Add new restore point
      const newRestorePoint = {
        id: `RP${String(restorePoints.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString(),
        description: 'Manual Backup',
        size: '2.5 GB',
        createdBy: 'admin@system.com',
        status: 'success'
      };
      setRestorePoints(prev => [newRestorePoint, ...prev]);
    }, 2000);
  };

  // Handle export
  const handleExport = (dataset, format) => {
    setExportProgress(prev => ({ ...prev, [dataset]: 0 }));

    const interval = setInterval(() => {
      setExportProgress(prev => {
        const newProgress = (prev[dataset] || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExportProgress(prev => {
              const newState = { ...prev };
              delete newState[dataset];
              return newState;
            });
          }, 1000);
        }
        return { ...prev, [dataset]: newProgress };
      });
    }, 200);
  };

  // Handle restore
  const handleRestore = (point) => {
    setSelectedRestorePoint(point);
    setShowRestoreModal(true);
  };

  // Confirm restore
  const confirmRestore = () => {
    // Simulate restore process
    console.log('Restoring from:', selectedRestorePoint);
    setShowRestoreModal(false);
    setSelectedRestorePoint(null);
  };

  // Handle delete
  const handleDelete = (point) => {
    setSelectedRestorePoint(point);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    setRestorePoints(prev => prev.filter(p => p.id !== selectedRestorePoint.id));
    setShowDeleteModal(false);
    setSelectedRestorePoint(null);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      success: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      warning: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle },
      failed: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Settings }
    };

    const { color, icon: Icon } = config[status] || config.success;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Backup & Restore</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage system backups, data exports, and restore points
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Database Backups Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-600" />
                  Database Backups
                </h2>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={backupData.automated}
                      onChange={(e) => setBackupData(prev => ({ ...prev, automated: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    Enable Automated Backups
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Schedule</span>
                  <select
                    value={backupData.schedule}
                    onChange={(e) => handleScheduleChange(e.target.value)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm"
                  >
                    <option value="manual">Manual</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Last Backup</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(backupData.lastBackup)}
                    </div>
                    <StatusBadge status={backupData.status} />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Next Backup</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {backupData.schedule === 'manual' ? 'Manual only' : formatDate(backupData.nextBackup)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{backupData.size}</div>
                  </div>
                </div>

                <button
                  onClick={runManualBackup}
                  disabled={backupData.status === 'processing'}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {backupData.status === 'processing' ? 'Backing Up...' : 'Run Backup Now'}
                </button>
              </div>
            </div>

            {/* Data Export Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Download className="w-5 h-5 mr-2 text-green-600" />
                  Data Export
                </h2>
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </button>
              </div>

              <div className="space-y-4">
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  const progress = exportProgress[option.id] || 0;

                  return (
                    <div key={option.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{option.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {progress > 0 && (
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                          <div className="flex space-x-1">
                            {option.format.map((format) => (
                              <button
                                key={format}
                                onClick={() => handleExport(option.id, format)}
                                disabled={progress > 0}
                                className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded disabled:opacity-50 transition-colors duration-200"
                              >
                                {format.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Restore Points Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-purple-600" />
                  Restore Points
                </h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search restore points..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-64"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredRestorePoints.map((point) => (
                  <div key={point.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">{point.id}</span>
                          <StatusBadge status={point.status} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{point.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDate(point.date)}</span>
                          <span>{point.size}</span>
                          <span>By {point.createdBy}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRestore(point)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                          title="Restore System"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(point)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          title="Delete Restore Point"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backup Monitoring Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                Backup Monitoring
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{backupStats.storageUsed}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Storage Used</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{backupStats.totalBackups}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Backups</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{backupStats.successRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Backup Success Trend</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={backupStats.trends}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Storage Breakdown</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={backupStats.storageBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {backupStats.storageBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Alert Cards */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Storage nearing capacity
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                      85% of allocated storage used. Consider cleaning up old backups.
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Backup logs available
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        View detailed backup history and logs
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cloud Integration */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-indigo-600" />
                Cloud Integration
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={cloudIntegration}
                  onChange={(e) => setCloudIntegration(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Sync backups to cloud storage (AWS S3, Google Drive)
            </p>
            <div className="flex space-x-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                AWS S3
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                Google Drive
              </span>
            </div>
          </div>

          {/* Email Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Email Alerts
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive notifications for backup success/failure
            </p>
          </div>

          {/* Retention Policy */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Retention Policy
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Keep backups for {retentionPolicy} days
            </p>
            <input
              type="range"
              min="7"
              max="365"
              value={retentionPolicy}
              onChange={(e) => setRetentionPolicy(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>7 days</span>
              <span>1 year</span>
            </div>
          </div>
        </div>

        {/* Restore Confirmation Modal */}
        {showRestoreModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm System Restore
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to restore the system from{' '}
                <strong>{selectedRestorePoint?.id}</strong>? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRestore}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Restore System
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delete Restore Point
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete restore point{' '}
                <strong>{selectedRestorePoint?.id}</strong>? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default BackupRestore;