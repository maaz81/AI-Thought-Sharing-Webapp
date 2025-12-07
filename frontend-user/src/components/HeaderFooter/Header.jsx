import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../../assets/avatar.jpeg";
import InsightShareLogo from "../../assets/InsightShare Logo.png";
import { ThemeContext } from "../context/ThemeContext";
import { SunIcon, MoonIcon, PlusIcon, SparklesIcon } from "@heroicons/react/24/solid";

const Header = () => {
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-brand-surface/95 dark:bg-brandDark-surface/95 backdrop-blur-md border-b border-brand-border/30 dark:border-brandDark-border/30 shadow-soft' 
        : 'bg-brand-surface dark:bg-brandDark-surface border-b border-brand-border/20 dark:border-brandDark-border/20'
    }`}>
      <div className="container">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img
                src={InsightShareLogo}
                alt="InsightShare Logo"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              InsightShare
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Pricing Link */}
            <Link 
              to="/pricing" 
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg 
                text-brand-muted hover:text-brand-primary dark:text-brandDark-muted dark:hover:text-brand-primary 
                hover:bg-brand-bg/50 dark:hover:bg-brandDark-bg/50 
                transition-all duration-200 group relative"
            >
              <SparklesIcon className="w-4 h-4 text-brand-accent" />
              <span className="font-medium">Pricing</span>
              <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-brand-accent to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>

            {/* Create Post Link */}
            <Link 
              to="/profile/post" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 
                text-brand-primary hover:text-brand-primaryHover 
                border border-brand-primary/20 hover:border-brand-primary/40
                transition-all duration-200 hover:shadow-md group"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="font-semibold">Create Post</span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2 rounded-full 
                bg-brand-bg/50 dark:bg-brandDark-bg/50 
                text-brand-muted hover:text-brand-primary dark:text-brandDark-muted dark:hover:text-brand-primary 
                border border-brand-border/30 dark:border-brandDark-border/30
                hover:border-brand-primary/30 dark:hover:border-brand-primary/30
                transition-all duration-300 hover:scale-105 hover:shadow-soft
                group"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />
              ) : (
                <MoonIcon className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
              )}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary/0 to-brand-accent/0 group-hover:from-brand-primary/10 group-hover:to-brand-accent/10 transition-all duration-300"></div>
            </button>

            {/* Profile / Login */}
            {isLoggedIn ? (
              <Link to="/profile" className="group relative">
                <div className="relative p-0.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent">
                  <img
                    src={userPhoto || defaultAvatar}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full border-2 border-brand-surface dark:border-brandDark-surface object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-state-success rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ) : (
              <Link to="/login" className="group">
                <button
                  className="relative px-6 py-2.5 rounded-full 
                    bg-gradient-to-r from-brand-primary to-brand-primaryHover 
                    text-white font-semibold 
                    shadow-lg shadow-brand-primary/25
                    transition-all duration-300 
                    hover:shadow-xl hover:shadow-brand-primary/35
                    hover:scale-105 
                    focus:outline-none focus:ring-4 focus:ring-brand-primary/30
                    overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-center space-x-4 pb-4 pt-2">
          <Link 
            to="/pricing" 
            className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg 
              text-brand-muted hover:text-brand-primary dark:text-brandDark-muted dark:hover:text-brand-primary 
              hover:bg-brand-bg/50 dark:hover:bg-brandDark-bg/50 
              transition-all duration-200"
          >
            <SparklesIcon className="w-4 h-4 text-brand-accent" />
            <span className="font-medium">Pricing</span>
          </Link>

          <Link 
            to="/profile/post" 
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg 
              bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 
              text-brand-primary hover:text-brand-primaryHover 
              border border-brand-primary/20
              transition-all duration-200"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="font-semibold">Create</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;