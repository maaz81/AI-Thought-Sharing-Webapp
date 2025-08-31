import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/pages/Login/LoginPage';
import Dashboard from './components/pages/Dashboard/Dashboard';
import PostsPage from './components/pages/Dashboard/PostsPage';
import ProtectedRoute from './components/protectedRoutes/ProtectedRoute';

function App() {
  return (
    <Router>
      <nav className="p-4 flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/posts">Posts</Link>
      </nav>

      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/posts" element={<PostsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
