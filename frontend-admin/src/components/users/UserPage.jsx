import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../../features/auth/usersPageSlice";
import Sidebar from "../dashboard/Sidebar";

function UserDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.userList);
  const user = userList.find((u) => u.id === id);

  if (!user) {
    return <div className="p-6">User not found.</div>;
  }

  // Profile completion calculation
  const profileFields = [
    user.username,
    user.email,
    user.basic_info?.bio,
    user.professional?.education,
    user.contact?.phone,
    user.basic_info?.location,
  ];
  const filledFields = profileFields.filter((f) => f && f !== "").length;
  const progress = Math.round((filledFields / profileFields.length) * 100);

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto text-gray-900 dark:text-gray-100">
        {/* Page Header */}
        <header>
          <h2 className="text-2xl font-semibold">User Profile</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Details & activities of{" "}
            <span className="font-medium">{user.username}</span>
          </p>
        </header>

        {/* Profile Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Profile Completion</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {progress}% completed
          </p>
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Basic Info</h4>
              <p><strong>UserID:</strong> {user.id}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Bio:</strong> {user.basic_info?.bio || "N/A"}</p>
              <p><strong>Profession:</strong> {user.basic_info?.profession || "N/A"}</p>
              <p><strong>Location:</strong> {user.basic_info?.location || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Activity</h4>
              <p><strong>Total Posts:</strong> {user.totalPosts}</p>
              <p><strong>Total Likes:</strong> {user.totalLikes}</p>
              <p><strong>Public Posts:</strong> {user.publicPosts || 0}</p>
              <p><strong>Private Posts:</strong> {user.privatePosts || 0}</p>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">User Posts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-2">Post ID</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Likes</th>
                  <th className="px-4 py-2">Dislikes</th>
                  <th className="px-4 py-2">Reports</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {user.posts?.map((post) => (
                  <tr key={post.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{post.id}</td>
                    <td className="px-4 py-2">{post.title}</td>
                    <td className="px-4 py-2">{post.likes}</td>
                    <td className="px-4 py-2">{post.dislikes}</td>
                    <td className="px-4 py-2">{post.reports}</td>
                    <td className="px-4 py-2 space-x-2">
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        onClick={() =>
                          dispatch(deletePost({ userId: user.id, postId: post.id }))
                        }
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(!user.posts || user.posts.length === 0) && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No posts available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDetails;
