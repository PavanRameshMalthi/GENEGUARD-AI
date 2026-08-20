import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore - mock hook
import { useAuth } from '@/hooks/useAuth';
// @ts-ignore - mock hook
import { useTheme } from '@/hooks/useTheme';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const { theme, setTheme } = useTheme() || { theme: 'light', setTheme: () => {} };
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary-500" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">GeneGuard AI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white font-bold hover:shadow-xl transition-all"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="py-1">
                        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <User className="h-4 w-4 mr-2" /> Profile
                        </Link>
                        <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <SettingsIcon className="h-4 w-4 mr-2" /> Settings
                        </Link>
                        <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 font-medium px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-xl shadow-primary-500/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {user ? (
                <>
                  <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Profile</Link>
                  <Link to="/settings" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Settings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
