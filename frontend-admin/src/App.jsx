import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/pages/Login/LoginPage';
import Dashboard from './components/pages/Dashboard/Dashboard';
import PostsPage from './components/pages/Dashboard/PostsPage';
import ProtectedRoute from './components/protectedRoutes/ProtectedRoute';

function App() {
  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/posts">Posts</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <PostsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
