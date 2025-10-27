import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import PostCard from "./components/dashboard/PostCard";
import CreatePost from "./components/dashboard/CreatePost";
import SearchBar from "./components/dashboard/SearchBar";
import ProfilePage from "./components/profile/ProfilePage";
import PrivateRoute from "./components/auth/PrivateRoute";
import UpdatePost from "./components/profile/UpdatePost";
import UpdateProfile from "./components/profile/UpdateProfile";
import PostDetails from "./components/dashboard/PostDetails";
import Pricing from "./components/pricing/Pricing";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/" element={<PostCard />} />
        <Route path="/post/:postId" element={<PostDetails />} />


        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/post" element={<CreatePost />} />
          <Route path="/profile/post/update/:id" element={<UpdatePost />} />
          <Route path="/profile/update/" element={<UpdateProfile />} />
        </Route>

        
      </Routes>
    </Router>
  );
}

export default App;
