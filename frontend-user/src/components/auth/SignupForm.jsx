import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/auth/register", formData);
      console.log("Signup successful:", response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setFormData({ name: "", email: "", password: "", role: "user" });
      navigate("/");
    } catch (error) {
      const resData = error.response?.data;
      let errorMessage = "Signup failed. Please try again.";

      if (resData?.message) {
        errorMessage = resData.message;
      } else if (resData?.error) {
        errorMessage = resData.error;
      } else if (resData?.errors && Array.isArray(resData.errors)) {
        errorMessage = resData.errors.map(err => err.message).join(", ");
      }

      console.error("Signup error:", resData || error.message);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign Up</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
              required
            />
          </div>
          <div className="flex items-center space-x-6 mt-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === "user"}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-blue-600 dark:text-black"
              />
              <span className="ml-2 text-gray-700">User</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-blue-600 dark:text-black"
              />
              <span className="ml-2 text-gray-700">Admin</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md transition duration-300 ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
