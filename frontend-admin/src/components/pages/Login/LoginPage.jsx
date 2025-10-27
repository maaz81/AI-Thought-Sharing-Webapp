import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '../../../features/auth/authSlice';
import { useAuth } from '../../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin(form));
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <img
            src="/admin-logo.svg"
            alt="Admin Logo"
            className="w-16 h-16 mx-auto mb-2"
          />
          <h2 className="text-2xl font-extrabold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Please sign in to your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-semibold rounded-lg transition-all ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging in...</span>
              </div>
            ) : (
              'Login'
            )}
          </button>

          {error && (
            <div className="text-red-600 text-sm mt-2 text-center">{error}</div>
          )}
        </form>

        <div className="mt-6 text-sm text-center text-gray-500">
          Need help? <a href="/support" className="text-blue-500 hover:underline">Contact support</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
