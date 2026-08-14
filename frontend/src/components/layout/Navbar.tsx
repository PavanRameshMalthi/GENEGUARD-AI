import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Activity, Moon, Sun, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">GeneGuard AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="hidden sm:inline-flex">Dashboard</Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" title="Profile">
                    <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                  <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Start Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
