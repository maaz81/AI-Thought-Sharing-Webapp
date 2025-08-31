import { logoutAdmin } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useDashboard } from '../../../hooks/useDashboard';
import  Card  from '../../cards and charts/Card'

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useDashboard();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => dispatch(logoutAdmin())}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-xl">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Posts</h2>
            <p className="text-xl">{stats.totalPosts}</p>
          </div>
        </div>
      )}

      <Card />
    </div>
  );
};

export default Dashboard;
