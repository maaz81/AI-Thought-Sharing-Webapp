import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import PostCard from "./components/dashboard/PostCard";
import CreatePost from "./components/dashboard/CreatePost";
import SearchBar from "./components/dashboard/SearchBar";
import ProfilePage from "./components/profile/ProfilePage";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<PostCard />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/post" element={<CreatePost />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
