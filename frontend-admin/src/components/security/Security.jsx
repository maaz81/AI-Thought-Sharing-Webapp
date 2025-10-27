// Security.jsx
import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Users,
  KeyRound,
  Lock,
  Globe,
  LogOut,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Monitor
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const Security = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [autoTimeoutEnabled, setAutoTimeoutEnabled] = useState(true);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock data for charts
  const securityMetrics = [
    { name: 'Mon', failedLogins: 12, apiCalls: 1200, suspicious: 2 },
    { name: 'Tue', failedLogins: 8, apiCalls: 980, suspicious: 1 },
    { name: 'Wed', failedLogins: 15, apiCalls: 1450, suspicious: 4 },
    { name: 'Thu', failedLogins: 6, apiCalls: 1100, suspicious: 1 },
    { name: 'Fri', failedLogins: 22, apiCalls: 1650, suspicious: 7 },
    { name: 'Sat', failedLogins: 9, apiCalls: 890, suspicious: 2 },
    { name: 'Sun', failedLogins: 5, apiCalls: 750, suspicious: 0 }
  ];

  const apiUsageData = [
    { name: '00:00', requests: 45 },
    { name: '04:00', requests: 32 },
    { name: '08:00', requests: 156 },
    { name: '12:00', requests: 289 },
    { name: '16:00', requests: 198 },
    { name: '20:00', requests: 134 }
  ];

  const securityHealthData = [
    { name: 'Healthy', value: 85 },
    { name: 'Risky', value: 12 },
    { name: 'Critical', value: 3 }
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  // Mock data for tables
  const [failedLogins, setFailedLogins] = useState([
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      ip: '192.168.1.45',
      location: 'New York, US',
      timestamp: '2024-01-15 14:30:22',
      status: 'Failed',
      severity: 'medium'
    },
    {
      id: 2,
      username: 'admin',
      email: 'admin@platform.com',
      ip: '103.45.67.89',
      location: 'Beijing, CN',
      timestamp: '2024-01-15 13:15:10',
      status: 'Blocked',
      severity: 'high'
    },
    {
      id: 3,
      username: 'sarah_m',
      email: 'sarah@example.com',
      ip: '172.16.254.1',
      location: 'London, UK',
      timestamp: '2024-01-15 12:45:33',
      status: 'Suspicious',
      severity: 'high'
    }
  ]);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      username: 'alex_w',
      device: 'Desktop',
      ip: '192.168.1.100',
      loginTime: '2024-01-15 09:15:00',
      lastActive: '2024-01-15 14:25:00',
      deviceIcon: <Monitor className="w-4 h-4" />
    },
    {
      id: 2,
      username: 'maria_k',
      device: 'Mobile',
      ip: '192.168.1.101',
      loginTime: '2024-01-15 11:30:00',
      lastActive: '2024-01-15 14:28:00',
      deviceIcon: <Smartphone className="w-4 h-4" />
    }
  ]);

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Frontend App',
      owner: 'dev_team',
      requests: 1250,
      limit: 1000,
      status: 'Active',
      lastUsed: '2024-01-15 14:20:00'
    },
    {
      id: 2,
      name: 'Mobile App',
      owner: 'mobile_team',
      requests: 850,
      limit: 2000,
      status: 'Active',
      lastUsed: '2024-01-15 13:45:00'
    }
  ]);

  const [whitelistIps, setWhitelistIps] = useState(['192.168.1.0/24', '10.0.0.50']);
  const [newIp, setNewIp] = useState('');

  // Security overview cards data
  const securityCards = [
    {
      title: 'Failed Logins',
      value: '134',
      change: '+12%',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Suspicious IPs',
      value: '7',
      change: '-2%',
      icon: <Globe className="w-6 h-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Active Sessions',
      value: '22',
      change: '+5%',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'API Requests',
      value: '4,200',
      change: '+18%',
      icon: <KeyRound className="w-6 h-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  const handleBlockIP = (ip) => {
    setFailedLogins(prev => 
      prev.map(login => 
        login.ip === ip ? { ...login, status: 'Blocked' } : login
      )
    );
  };

  const handleForceLogout = (sessionId) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const handleTerminateAllSessions = () => {
    setActiveSessions([]);
  };

  const handleRevokeApiKey = (keyId) => {
    setApiKeys(prev => 
      prev.map(key => 
        key.id === keyId ? { ...key, status: 'Revoked' } : key
      )
    );
  };

  const handleAddWhitelistIp = () => {
    if (newIp && !whitelistIps.includes(newIp)) {
      setWhitelistIps(prev => [...prev, newIp]);
      setNewIp('');
    }
  };

  const handleRemoveWhitelistIp = (ip) => {
    setWhitelistIps(prev => prev.filter(item => item !== ip));
  };

  const runAnonymizationJob = () => {
    // Mock anonymization job
    alert('Data anonymization job started successfully!');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Security Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage all security aspects of your AI Thought Sharing Platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b dark:border-gray-700 pb-4">
          {['overview', 'login-security', 'sessions', 'api-security', 'privacy', 'ip-management'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Security Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Security Health Meter */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Security Health Status
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <PieChart width={128} height={128}>
                    <Pie
                      data={securityHealthData}
                      cx={64}
                      cy={64}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {securityHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-500">85%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Healthy: 85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Risky: 12%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Critical: 3%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    System security is in good condition. Monitor suspicious activities regularly.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityCards.map((card, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 ${card.bgColor}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <div className={card.color}>{card.icon}</div>
                    </div>
                    <span className={`text-sm font-medium ${card.change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                      {card.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{card.value}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{card.title}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Failed Logins Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Failed Login Attempts</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={securityMetrics}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="failedLogins" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* API Usage Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">API Usage Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={apiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Failed Login & Suspicious Activities */}
        {activeTab === 'login-security' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Failed Login Attempts & Suspicious Activities
                </h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">IP Address</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Timestamp</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedLogins.map((login) => (
                      <tr key={login.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{login.username}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{login.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">{login.ip}</td>
                        <td className="py-3 px-4">{login.location}</td>
                        <td className="py-3 px-4">{login.timestamp}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            login.status === 'Failed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            login.status === 'Blocked' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }`}>
                            {login.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBlockIP(login.ip)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Block IP"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Session Management */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Active Sessions Management
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleTerminateAllSessions}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminate All Sessions
                  </button>
                </div>
              </div>

              {/* Session Settings */}
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Session Timeout</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically log out users after period of inactivity
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      min="1"
                      max="1440"
                    />
                    <span>minutes</span>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={autoTimeoutEnabled}
                        onChange={(e) => setAutoTimeoutEnabled(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        autoTimeoutEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        autoTimeoutEnabled ? 'transform translate-x-6' : ''
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Device</th>
                      <th className="text-left py-3 px-4">IP Address</th>
                      <th className="text-left py-3 px-4">Login Time</th>
                      <th className="text-left py-3 px-4">Last Active</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions.map((session) => (
                      <tr key={session.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 font-medium">{session.username}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {session.deviceIcon}
                            <span>{session.device}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">{session.ip}</td>
                        <td className="py-3 px-4">{session.loginTime}</td>
                        <td className="py-3 px-4">{session.lastActive}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleForceLogout(session.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1 text-sm"
                          >
                            <LogOut className="w-3 h-3" />
                            Force Logout
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

        {/* API Security */}
        {activeTab === 'api-security' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-500" />
                  API Key Management
                </h2>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Generate New API Key
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4">API Key Name</th>
                      <th className="text-left py-3 px-4">Owner</th>
                      <th className="text-left py-3 px-4">Requests Today</th>
                      <th className="text-left py-3 px-4">Rate Limit</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Last Used</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 font-medium">{key.name}</td>
                        <td className="py-3 px-4">{key.owner}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{key.requests.toLocaleString()}</span>
                            {key.requests > key.limit && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{key.limit.toLocaleString()}/min</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            key.status === 'Active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {key.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{key.lastUsed}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRevokeApiKey(key.id)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Revoke Key"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit Limit"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="Regenerate"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Usage Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">API Call Trends (Last 24 Hours)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={apiUsageData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Privacy & Compliance */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            {/* GDPR Tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                GDPR Compliance Tools
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Data Export Requests</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Process user data export requests as per GDPR Right to Access
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-500">12</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending requests</span>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Process Exports
                  </button>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Data Deletion Requests</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Handle user data deletion requests (Right to be Forgotten)
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-500">8</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending requests</span>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Review Deletions
                  </button>
                </div>
              </div>

              {/* Consent Management */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Consent Management</h3>
                <div className="flex items-center justify-between mb-4">
                  <span>Users with marketing consent</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>

            {/* Data Anonymization */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Data Anonymization</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">Anonymize Inactive User Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically anonymize data for users inactive for more than 2 years
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="w-12 h-6 rounded-full bg-green-500"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transform translate-x-6"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">Run Anonymization Job</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manually trigger data anonymization process
                    </p>
                  </div>
                  <button
                    onClick={runAnonymizationJob}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Run Job
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Updates */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Policy Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">Privacy Policy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last updated: 2024-01-10
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Edit Policy
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">Notify Users About Changes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send notifications when policies are updated
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <div className="w-12 h-6 rounded-full bg-green-500"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transform translate-x-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IP Management */}
        {activeTab === 'ip-management' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                IP Whitelist Management
              </h2>

              {/* Add IP Form */}
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold mb-3">Add IP to Whitelist</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="Enter IP address or CIDR (e.g., 192.168.1.0/24)"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddWhitelistIp}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add IP
                  </button>
                </div>
              </div>

              {/* IP List */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="p-4 border-b dark:border-gray-700">
                  <h3 className="font-semibold">Whitelisted IP Addresses</h3>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {whitelistIps.map((ip, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-mono">{ip}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveWhitelistIp(ip)}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2FA Control */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                Two-Factor Authentication
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">2FA Enforcement for Admins</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Require all admin users to enable two-factor authentication
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={twoFAEnabled}
                      onChange={(e) => setTwoFAEnabled(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      twoFAEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}></div>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      twoFAEnabled ? 'transform translate-x-6' : ''
                    }`}></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">156</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Users with 2FA</div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-500 mb-1">78%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Admin Coverage</div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500 mb-1">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending Setup</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;