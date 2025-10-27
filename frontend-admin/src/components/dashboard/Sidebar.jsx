import { useEffect, useState } from 'react';
import {
  Home, Users, FileText, Flag, Shield, BrainCircuit, BarChart,
  ClipboardList, Settings, UserCog, Database, Bell, Lock,
  UserCircle, LogOut, Moon, Sun, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutModal from '../pages/Login/Logout';

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userTheme = localStorage.getItem('theme');
    const isDark = userTheme === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { label: 'Dashboard', icon: <Home size={20} />, href: '/' },
    { label: 'Users', icon: <Users size={20} />, href: '/users' },
    { label: 'Posts', icon: <FileText size={20} />, href: '/posts' },
    { label: 'Reports', icon: <Flag size={20} />, href: '/reports' },
    { divider: true },
    { label: 'Moderation', icon: <Shield size={20} />, href: '/moderation' },
    { label: 'AI Management', icon: <BrainCircuit size={20} />, href: '/ai-flagged' },
    { divider: true },
    { label: 'Analytics', icon: <BarChart size={20} />, href: '/analytics' },
    { label: 'Audit Logs', icon: <ClipboardList size={20} />, href: '/logs' },
    { label: 'Settings', icon: <Settings size={20} />, href: '/admin/settings' },
    { label: 'Roles & Permissions', icon: <UserCog size={20} />, href: '/roles' },
    { label: 'Backup & Restore', icon: <Database size={20} />, href: '/backup' },
    { divider: true },
    { label: 'Notifications', icon: <Bell size={20} />, href: '/notifications' },
    { label: 'Security', icon: <Lock size={20} />, href: '/security' },
  ];

  const bottomNav = [
    { label: 'My Account', icon: <UserCircle size={20} />, href: '/profile' },
    { label: 'Dark Mode', icon: isDarkMode ? <Sun size={20} /> : <Moon size={20} />, isButton: true },
    { label: 'Logout', icon: <LogOut size={20} />, onClick: () => setShowLogoutModal(true), danger: true },
  ];

  return (
    <>
      <aside
        className={`
          ${isCollapsed ? 'w-16' : 'w-64'}
          relative h-screen flex flex-col justify-between
          bg-white/80 dark:bg-gray-900/80
          backdrop-blur-xl backdrop-saturate-150
          border-r border-gray-200/60 dark:border-gray-700/50
          shadow-xl shadow-gray-200/20 dark:shadow-gray-900/30
          transition-all duration-300 ease-in-out
        `}
      >
        {/* --- Header Section --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/40 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                <BrainCircuit size={20} className="text-white" />
              </div>
              {!isCollapsed && (
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent tracking-tight truncate">
                  AI Admin
                </h1>
              )}
            </div>

            <button
              onClick={toggleCollapse}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight size={16} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              ) : (
                <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              )}
            </button>
          </div>

          {/* --- Navigation Items --- */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
            {navItems.map((item, index) =>
              item.divider ? (
                <div
                  key={`divider-${index}`}
                  className="my-3 mx-2 border-t border-gray-200/40 dark:border-gray-700/30"
                />
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`
                    group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                    ${location.pathname === item.href
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md shadow-blue-500/10 border border-blue-200/50 dark:border-blue-700/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:shadow-gray-500/5'
                    }
                  `}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className={`
                    transition-transform duration-200
                    ${location.pathname === item.href ? 'scale-110' : 'group-hover:scale-105'}
                  `}>
                    {item.icon}
                  </span>
                  
                  {!isCollapsed && (
                    <span className="font-medium text-sm transition-all duration-200">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && hoveredItem === item.label && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* --- Bottom Actions --- */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/40 p-3 space-y-1 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50">
          {bottomNav.map((item) => {
            if (item.isButton) {
              return (
                <button
                  key={item.label}
                  onClick={toggleDarkMode}
                  className="group relative flex items-center gap-3 p-3 w-full text-left rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:shadow-md hover:shadow-gray-500/5 transition-all duration-200"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="transition-transform duration-200 group-hover:scale-105">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && hoveredItem === item.label && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </div>
                  )}
                </button>
              );
            }

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`group relative flex items-center gap-3 p-3 w-full text-left rounded-xl transition-all duration-200 ${
                    item.danger
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:shadow-md hover:shadow-red-500/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:shadow-gray-500/5'
                  }`}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="transition-transform duration-200 group-hover:scale-105">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && hoveredItem === item.label && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href}
                className="group relative flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:shadow-gray-500/5 transition-all duration-200"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="transition-transform duration-200 group-hover:scale-105">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === item.label && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* --- Centered Logout Modal --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <LogoutModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleLogout}
          />
        </div>
      )}
    </>
  );
}