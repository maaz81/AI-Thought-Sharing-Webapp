import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../../assets/avatar.jpeg";
import InsightShareLogo from "../../assets/InsightShare Logo.png";
import { ThemeContext } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Header = () => {
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/update/profile/userphoto",
          { withCredentials: true }
        );
        if (res.data) {
          setUserPhoto(`http://localhost:5000/uploads/${res.data}`);
          setIsLoggedIn(true);
        } else {
          setUserPhoto(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user photo:", error);
        setUserPhoto(null);
        setIsLoggedIn(false);
      }
    };
    fetchUserPhoto();
  }, []);

  return (
    <header className="bg-blue-600 text-white shadow-md dark:bg-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" className="flex items-center">
          <img
            src={InsightShareLogo}
            alt="Logo"
            className="h-44 w-auto object-contain"
          />
        </Link>

        <nav className="space-x-9 flex items-center">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 rounded-full 
              bg-gray-200 text-gray-800 
              dark:bg-gray-800 dark:text-yellow-300 
              hover:scale-105 transform transition-all duration-300 shadow-md"
          >
            {darkMode ? (
              <>
                <SunIcon className="w-5 h-5 text-yellow-400 animate-spin-slow" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="w-5 h-5 text-blue-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Links */}
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/profile/post" className="hover:underline">
            Create Post
          </Link>

          {/* Profile / Login */}
          {isLoggedIn ? (
            <Link to="/profile">
              <img
                src={userPhoto || defaultAvatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </Link>
          ) : (
            <Link to="/login">
              <button
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 
               hover:from-indigo-600 hover:to-blue-500 
               text-white font-semibold shadow-lg shadow-blue-500/30
               transition-all duration-300 transform hover:scale-110 
               focus:outline-none focus:ring-4 focus:ring-blue-300 
               animate-pulse"
              >
                Login
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
