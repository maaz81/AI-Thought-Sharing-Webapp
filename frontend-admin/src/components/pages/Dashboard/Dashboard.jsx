import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../../features/auth/authSlice';
import { useAuth } from '../../../hooks/useAuth';

const Dashboard = () => {
  const { admin } = useAuth();
  const dispatch = useDispatch();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {admin?.email}</h1>
      <button
        onClick={() => dispatch(logoutAdmin())}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
