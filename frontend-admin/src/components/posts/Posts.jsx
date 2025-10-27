import { useSelector } from "react-redux";
import {  selectAllPosts, selectPostStats } from "../../features/auth/postsStatsSlice";

import Sidebar from "../dashboard/Sidebar";
import { useMemo } from "react";

function Posts() {
  const posts = useSelector(selectAllPosts);
  const stats = useSelector(selectPostStats);

  // 🟢 Stats calculation


  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header>
          <h2 className="text-2xl font-semibold">Posts Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of all user posts
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold">Total Posts</h3>
            <p className="text-2xl">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold">Public / Private</h3>
            <p>{stats.publicPosts} / {stats.privatePosts}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold">Likes / Dislikes</h3>
            <p>{stats.totalLikes} 👍 | {stats.totalDislikes} 👎</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold">Recent</h3>
            <p>Last 1d: {stats.lastDay}, 7d: {stats.last7Days}, 30d: {stats.lastMonth}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow col-span-2">
            <h3 className="font-semibold mb-2">Tags</h3>
            {Object.keys(stats.tags).length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {Object.entries(stats.tags).map(([tag, count]) => (
                  <li key={tag} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                    {tag} ({count})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No tags available</p>
            )}
          </div>
        </div>

        {/* Posts Table */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">All Posts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-2">Post ID</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Visibility</th>
                  <th className="px-4 py-2">Likes</th>
                  <th className="px-4 py-2">Created At</th>
                  <th className="px-4 py-2">View Post</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{post.id}</td>
                    <td className="px-4 py-2">{post.title}</td>
                    <td className="px-4 py-2">{post.username}</td>
                    <td className="px-4 py-2">{post.visibility}</td>
                    <td className="px-4 py-2">{post.likes}</td>
                    <td className="px-4 py-2">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">View Full Post</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Posts;
