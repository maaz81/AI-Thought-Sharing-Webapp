import { useState } from "react";
import {
  Users,
  Brain,
  AlertTriangle,
  Activity,
  MessageCircle,
  UserPlus,
  Server,
  Database,
  TrendingUp,
  Flame,
  PieChart,
  Clock,
  Shield,
  Edit,
  UserMinus,
  UserCog,
} from "lucide-react";

import Sidebar from "./Sidebar";
import KpiCard from "./KpiCard";
import UserGrowthChart from "../../charts/UserGrowthChart";
import EngagementHeatmap from "../../charts/EngagementHeatmap";
import AiUsageChart from "../../charts/AiUsageChart";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("7d");

  // Sample mock data (replace with Redux or API data)
  const kpiData = {
    totalUsers: 12340,
    totalThoughts: 45672,
    flaggedPosts: 27,
    activeUsers: 342,
    comments: 2354,
    newUsers: 120,
    latency: "230ms / 0.3%",
    backup: "2 hours ago",
  };

  const activeUsersList = [
    { username: "alex", posts: 42 },
    { username: "maria", posts: 39 },
    { username: "rahul", posts: 33 },
    { username: "lisa", posts: 30 },
    { username: "tom", posts: 27 },
  ];

  const trendingThoughts = [
    { title: "The Power of AI", likes: 230, comments: 45 },
    { title: "Mind & Machine", likes: 210, comments: 32 },
    { title: "Creativity Reimagined", likes: 190, comments: 41 },
    { title: "Shared Consciousness", likes: 150, comments: 25 },
    { title: "Ethics of AI", likes: 130, comments: 20 },
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header Area */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Platform overview and insights.
            </p>
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">This Month</option>
          </select>
        </header>

        {/* KPI Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <KpiCard title="Total Users" value={kpiData.totalUsers} icon={<Users />} trend="+5%" />
          <KpiCard title="Total Thoughts Shared" value={kpiData.totalThoughts} icon={<Brain />} trend="+8%" />
          <KpiCard title="Flagged / Reported Posts" value={kpiData.flaggedPosts} icon={<AlertTriangle />} trend="Needs review" />
          <KpiCard title="Active Users (24h)" value={kpiData.activeUsers} icon={<Activity />} trend="+3%" />
          <KpiCard title="Comments / Interactions" value={kpiData.comments} icon={<MessageCircle />} trend="+12%" />
          <KpiCard title="New Users (This Week)" value={kpiData.newUsers} icon={<UserPlus />} trend="+7%" />
          <KpiCard title="API Latency & Error Rate" value={kpiData.latency} icon={<Server />} trend="Stable" />
          <KpiCard title="Recent Backup Status" value={kpiData.backup} icon={<Database />} trend="Successful" />
        </section>

        {/* Charts & Visual Insights */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
          <div className="xl:col-span-2">
            <UserGrowthChart />
          </div>
          <AiUsageChart />
          <EngagementHeatmap />
        </section>

        {/* Moderation Snapshot */}
        <section className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md mb-10">
          <h3 className="mb-4 font-semibold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" /> Moderation Snapshot
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2">Action</th>
                  <th className="py-2">Count</th>
                  <th className="py-2">Last Update</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" /> Reported Posts
                  </td>
                  <td>12</td>
                  <td>2h ago</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 flex items-center gap-2">
                    <UserMinus className="w-4 h-4 text-red-500" /> Ban User
                  </td>
                  <td>3</td>
                  <td>1d ago</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 flex items-center gap-2">
                    <Edit className="w-4 h-4 text-green-500" /> Edit Content
                  </td>
                  <td>8</td>
                  <td>5h ago</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 flex items-center gap-2">
                    <UserCog className="w-4 h-4 text-blue-500" /> Role Updates
                  </td>
                  <td>4</td>
                  <td>3h ago</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" /> Auto Moderation
                  </td>
                  <td>5 triggers</td>
                  <td>30m ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Users & Trending Thoughts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Top Active Users */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
            <h3 className="mb-4 font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Top 5 Active Users
            </h3>
            <ul className="space-y-2 text-sm">
              {activeUsersList.map((user, i) => (
                <li key={i} className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                  <span>@{user.username}</span>
                  <span className="text-gray-500">{user.posts} posts</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Trending Thoughts */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
            <h3 className="mb-4 font-semibold flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Top 5 Trending Thoughts
            </h3>
            <ul className="space-y-2 text-sm">
              {trendingThoughts.map((post, i) => (
                <li key={i} className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                  <span>{post.title}</span>
                  <span className="text-gray-500">
                    👍 {post.likes} / 💬 {post.comments}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
