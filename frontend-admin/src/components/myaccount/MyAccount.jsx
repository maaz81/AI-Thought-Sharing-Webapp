import React, { useState, useEffect } from 'react';
import { 
  UserCircle, 
  Moon, 
  Sun, 
  LogOut, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Palette,
  Settings,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Key,
  Clock
} from 'lucide-react';

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mock admin data - in real app, this would come from API
  const [adminData, setAdminData] = useState({
    personal: {
      fullName: 'Alex Johnson',
      email: 'alex.johnson@admin.com',
      username: 'alex_admin',
      contactNumber: '+1 (555) 123-4567',
      profilePicture: '',
      timeZone: 'America/New_York',
      language: 'en'
    },
    professional: {
      role: 'Super Admin',
      joinedDate: '2024-01-15',
      lastLogin: '2024-12-19T14:30:00Z',
      department: 'Content Management',
      adminNotes: '— Moderated by Alex'
    },
    security: {
      twoFactorEnabled: false,
      sessions: [
        { id: 1, device: 'Chrome on Windows', location: 'New York, US', lastActive: '2 hours ago', current: true },
        { id: 2, device: 'Safari on iPhone', location: 'New York, US', lastActive: '1 day ago', current: false }
      ]
    },
    preferences: {
      accentColor: 'blue',
      emailNotifications: true,
      inAppNotifications: true,
      pushNotifications: false,
      compactLayout: false
    }
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setIsEditing(false);
    // Show success toast here
  };

  const handleInputChange = (section, field, value) => {
    setAdminData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const revokeSession = (sessionId) => {
    setAdminData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        sessions: prev.security.sessions.filter(session => session.id !== sessionId)
      }
    }));
  };

  const toggleTwoFactor = () => {
    setAdminData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled
      }
    }));
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: UserCircle },
    { id: 'professional', label: 'Professional', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ];

  const Card = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', readOnly = false, icon: Icon }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
            readOnly ? 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed' : ''
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {adminData.personal.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {adminData.personal.fullName}
              </h1>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {adminData.professional.role}
                </span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-300 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {adminData.personal.email}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
              
              <button className="p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 mb-8 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <UserCircle className="w-6 h-6 mr-3 text-blue-500" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    value={adminData.personal.fullName}
                    onChange={(value) => handleInputChange('personal', 'fullName', value)}
                    readOnly={!isEditing}
                    icon={UserCircle}
                  />
                  <InputField
                    label="Email"
                    value={adminData.personal.email}
                    readOnly={true}
                    icon={Mail}
                  />
                  <InputField
                    label="Username"
                    value={adminData.personal.username}
                    onChange={(value) => handleInputChange('personal', 'username', value)}
                    readOnly={!isEditing}
                    icon={UserCircle}
                  />
                  <InputField
                    label="Contact Number"
                    value={adminData.personal.contactNumber}
                    onChange={(value) => handleInputChange('personal', 'contactNumber', value)}
                    readOnly={!isEditing}
                    icon={Phone}
                  />
                  <InputField
                    label="Time Zone"
                    value={adminData.personal.timeZone}
                    onChange={(value) => handleInputChange('personal', 'timeZone', value)}
                    readOnly={!isEditing}
                    icon={Clock}
                  />
                  <InputField
                    label="Language"
                    value={adminData.personal.language}
                    onChange={(value) => handleInputChange('personal', 'language', value)}
                    readOnly={!isEditing}
                    icon={Settings}
                  />
                </div>
              </Card>
            )}

            {/* Professional Information */}
            {activeTab === 'professional' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-green-500" />
                  Professional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Role"
                    value={adminData.professional.role}
                    readOnly={true}
                    icon={Shield}
                  />
                  <InputField
                    label="Joined Date"
                    value={new Date(adminData.professional.joinedDate).toLocaleDateString()}
                    readOnly={true}
                    icon={Calendar}
                  />
                  <InputField
                    label="Last Login"
                    value={new Date(adminData.professional.lastLogin).toLocaleString()}
                    readOnly={true}
                    icon={Clock}
                  />
                  <InputField
                    label="Department"
                    value={adminData.professional.department}
                    onChange={(value) => handleInputChange('professional', 'department', value)}
                    readOnly={!isEditing}
                    icon={Settings}
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes / Signature
                  </label>
                  <textarea
                    value={adminData.professional.adminNotes}
                    onChange={(e) => handleInputChange('professional', 'adminNotes', e.target.value)}
                    readOnly={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-colors"
                  />
                </div>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-red-500" />
                    Security Settings
                  </h2>
                  
                  {/* Change Password */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Current Password"
                        type={showPassword ? 'text' : 'password'}
                        icon={Key}
                      />
                      <InputField
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        icon={Key}
                      />
                    </div>
                    <div className="flex items-center mt-4">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span>{showPassword ? 'Hide' : 'Show'} Passwords</span>
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button
                      onClick={toggleTwoFactor}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        adminData.security.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          adminData.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </Card>

                {/* Active Sessions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Active Sessions
                  </h3>
                  <div className="space-y-4">
                    {adminData.security.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {session.device}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {session.location} • {session.lastActive}
                                {session.current && (
                                  <span className="ml-2 text-blue-500 font-medium">Current Session</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <button
                            onClick={() => revokeSession(session.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Theme & Preferences */}
            {activeTab === 'preferences' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Palette className="w-6 h-6 mr-3 text-purple-500" />
                  Theme & Preferences
                </h2>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Theme</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Switch between dark and light mode
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>

                {/* Notification Settings */}
                <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Notification Settings
                  </h3>
                  <div className="space-y-3">
                    {['emailNotifications', 'inAppNotifications', 'pushNotifications'].map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                          {type.replace('Notifications', '')} Notifications
                        </span>
                        <button
                          onClick={() => handleInputChange('preferences', type, !adminData.preferences[type])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            adminData.preferences[type] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              adminData.preferences[type] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div className="py-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Accent Color
                  </h3>
                  <div className="flex space-x-3">
                    {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleInputChange('preferences', 'accentColor', color)}
                        className={`w-8 h-8 rounded-full bg-${color}-500 border-2 ${
                          adminData.preferences.accentColor === color
                            ? 'border-gray-900 dark:border-white ring-2 ring-offset-2 ring-blue-500'
                            : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                System Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Admin ID:</span>
                  <span className="text-gray-900 dark:text-white font-mono">ADM_789123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">MongoDB ID:</span>
                  <span className="text-gray-900 dark:text-white font-mono">507f1f77bcf86cd7...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="text-gray-900 dark:text-white">Jan 15, 2024</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  { action: 'Deleted post', target: '#123', time: '2 hours ago' },
                  { action: 'Approved user', target: 'john_doe', time: '5 hours ago' },
                  { action: 'Updated settings', target: 'System', time: '1 day ago' },
                  { action: 'Banned user', target: 'spam_account', time: '2 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white text-sm">
                        {activity.action} <span className="font-mono">{activity.target}</span>
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  View Admin Dashboard
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Manage Users
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  System Settings
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  Delete Account
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;