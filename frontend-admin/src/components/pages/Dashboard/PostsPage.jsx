import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, deletePost } from '../../../features/posts/postsSlice';

const PostsPage = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Posts</h1>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((post) => (
            <tr key={post._id}>
              <td className="border p-2">{post.title}</td>
              <td className="border p-2">{post.author || "Unknown"}</td>
              <td className="border p-2">
                <button
                  onClick={() => dispatch(deletePost(post._id))}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {list.length === 0 && !loading && (
            <tr>
              <td colSpan="3" className="text-center p-3">
                No posts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PostsPage;
