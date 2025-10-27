import { useSelector } from "react-redux";
import Sidebar from "../dashboard/Sidebar";
import KpiCard from "../dashboard/KpiCard";
import { Link } from "react-router-dom";

function Users() {
  const {
    users,
    activeUsers,
    BlockedUsers,
    flaggedPosts,
    userList = [],
  } = useSelector((state) => state.users || {});

  // Get top 6 users by totalPosts
  const topUsers = [...userList]
    .sort((a, b) => b.totalPosts - a.totalPosts)
    .slice(0, 6);

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Page Header */}
        <header className="mb-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to the admin panel.
          </p>
        </header>

        {/* KPI Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KpiCard title="Total Users" value={users} icon="👥" trend="+5% this week" />
          <KpiCard title="Active Users (24h)" value={activeUsers} icon="🟢" trend="+3% today" />
          <KpiCard title="Blocked Users" value={BlockedUsers} icon="✍️" trend="+12% growth" />
        </section>

        {/* Top Users Table */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Top 6 Users by Posts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Total Posts</th>
                  <th className="px-4 py-2">Total Likes</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">See Profile</th>
                  <th className="px-4 py-2">Registered Date</th>

                </tr>
              </thead>
              <tbody>
                {topUsers.map((user) => (
                  <tr key={user.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">
                      {new Date(user.registeredAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-2">{user.totalPosts}</td>
                    <td className="px-4 py-2">{user.totalLikes}</td>
                    <td className="px-4 py-2">
                      {user.isActive ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-yellow-500 font-medium">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        to={`/user/${user.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Full Profile
                      </Link>
                    </td>

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

export default Users;
