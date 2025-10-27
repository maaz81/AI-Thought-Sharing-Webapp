// Analytics.jsx
import React, { useState, useEffect } from 'react';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Users, FileText, TrendingUp, Cpu, Server, Download, 
  RefreshCw, Calendar, Activity, Eye
} from 'lucide-react';
import Sidebar from '../dashboard/Sidebar';

// Mock data for analytics
const generateMockData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    // User Analytics
    userGrowth: months.map(month => ({
      month,
      users: Math.floor(Math.random() * 1000) + 500,
      active: Math.floor(Math.random() * 800) + 200,
      newUsers: Math.floor(Math.random() * 300) + 100
    })),
    
    userStats: {
      totalUsers: 12543,
      monthlyGrowth: 12.5,
      activeUsers: 8432,
      inactiveUsers: 4111,
      retentionRate: 68.3
    },
    
    // Content Analytics
    contentStats: {
      totalPosts: 45678,
      avgPostsPerUser: 3.6,
      aiUsage: 23456,
      aiUsageRate: 51.3
    },
    
    popularTags: [
      { name: 'Technology', value: 12340, color: '#3B82F6' },
      { name: 'AI', value: 9876, color: '#10B981' },
      { name: 'Programming', value: 8567, color: '#8B5CF6' },
      { name: 'Design', value: 6543, color: '#F59E0B' },
      { name: 'Business', value: 5432, color: '#EF4444' }
    ],
    
    trendingTopics: [
      { topic: 'Machine Learning', posts: 2345, growth: 15.2 },
      { topic: 'Web Development', posts: 1987, growth: 8.7 },
      { topic: 'UX Design', posts: 1654, growth: 22.1 },
      { topic: 'Startup Ideas', posts: 1432, growth: 12.4 },
      { topic: 'AI Ethics', posts: 1289, growth: 18.9 }
    ],
    
    // Platform Analytics
    platformStats: {
      serverUptime: 99.98,
      avgResponseTime: 124,
      apiErrorRate: 0.23,
      dailySessions: 8923
    },
    
    dailySessions: Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i + 1}`,
      sessions: Math.floor(Math.random() * 2000) + 7000,
      errors: Math.floor(Math.random() * 50) + 10
    })),
    
    apiMetrics: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      requests: Math.floor(Math.random() * 5000) + 10000,
      successRate: 95 + Math.random() * 4
    }))
  };
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = duration / end;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Metric Card Component
const MetricCard = ({ title, value, icon, change, changeType = 'positive', format = 'number' }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        {React.cloneElement(icon, { 
          className: "w-6 h-6 text-blue-600 dark:text-blue-400" 
        })}
      </div>
      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
        changeType === 'positive' 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        {change}
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
      {format === 'percentage' ? `${value}%` : <AnimatedCounter value={value} />}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
  </div>
);

// Main Analytics Component
const Analytics = () => {
  const [data, setData] = useState(generateMockData());
  const [dateRange, setDateRange] = useState('30days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(generateMockData());
      setIsRefreshing(false);
    }, 1000);
  };

  const exportReport = (format) => {
    // Simulate report export
    alert(`Exporting analytics report as ${format.toUpperCase()}...`);
    // In real implementation, this would generate and download the file
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor platform performance and user engagement
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* Date Range Filter */}
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => exportReport('pdf')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Analytics Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          User Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Users"
            value={data.userStats.totalUsers}
            icon={<Users />}
            change="+12.5%"
          />
          <MetricCard
            title="Active Users"
            value={data.userStats.activeUsers}
            icon={<Activity />}
            change="+8.2%"
          />
          <MetricCard
            title="Retention Rate"
            value={data.userStats.retentionRate}
            icon={<TrendingUp />}
            change="+3.1%"
            format="percentage"
          />
          <MetricCard
            title="Monthly Growth"
            value={data.userStats.monthlyGrowth}
            icon={<Eye />}
            change="+2.4%"
            format="percentage"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="users" name="Total Users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="active" name="Active Users" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Content Analytics Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-green-600" />
          Content Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Posts"
            value={data.contentStats.totalPosts}
            icon={<FileText />}
            change="+15.3%"
          />
          <MetricCard
            title="Avg Posts/User"
            value={data.contentStats.avgPostsPerUser}
            icon={<TrendingUp />}
            change="+1.2"
            format="number"
          />
          <MetricCard
            title="AI Usage"
            value={data.contentStats.aiUsage}
            icon={<Cpu />}
            change="+25.8%"
          />
          <MetricCard
            title="AI Usage Rate"
            value={data.contentStats.aiUsageRate}
            icon={<Activity />}
            change="+8.7%"
            format="percentage"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Popular Tags Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Tags Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.popularTags}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.popularTags.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Trending Topics (Last 7 Days)
            </h3>
            <div className="space-y-4">
              {data.trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{topic.topic}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{topic.posts} posts</p>
                  </div>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                    +{topic.growth}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Analytics Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Server className="w-6 h-6 mr-2 text-purple-600" />
          Platform Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Server Uptime"
            value={data.platformStats.serverUptime}
            icon={<Server />}
            change="+0.02%"
            format="percentage"
          />
          <MetricCard
            title="Avg Response Time"
            value={data.platformStats.avgResponseTime}
            icon={<Activity />}
            change="-12ms"
            changeType="negative"
            format="number"
          />
          <MetricCard
            title="API Error Rate"
            value={data.platformStats.apiErrorRate}
            icon={<TrendingUp />}
            change="-0.05%"
            changeType="negative"
            format="percentage"
          />
          <MetricCard
            title="Daily Sessions"
            value={data.platformStats.dailySessions}
            icon={<Users />}
            change="+5.3%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Sessions Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Daily Active Sessions
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailySessions}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* API Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              API Performance (24h)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.apiMetrics}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2}
                  name="Success Rate %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Export Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Download className="w-6 h-6 mr-2 text-blue-600" />
          Export Reports
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export as PDF</span>
          </button>
          <button
            onClick={() => exportReport('csv')}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export as CSV</span>
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 font-medium transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Export as Excel</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Analytics;