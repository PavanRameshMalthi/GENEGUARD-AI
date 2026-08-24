import React, { useState } from 'react';
import { Menu, Search, User, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import NotificationDropdown from '@/components/features/NotificationDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/context/SidebarContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title,
  subtitle 
}) => {
  const { openMobile } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080c18] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 relative overflow-x-hidden antialiased selection:bg-indigo-500 selection:text-white">
      {/* Elevated Container */}
      <div className="w-full min-h-screen flex flex-row overflow-hidden relative">
        
        {/* Left Collapsible Sidebar (Desktop) */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto custom-scrollbar">
          {/* Top Navigation Bar (Reference Design 4 & 7) */}
          <header className="bg-white/95 dark:bg-[#0e1424]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-30 transition-colors">
            {/* Left Brand / Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={openMobile}
                aria-label="Open navigation drawer"
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link to="/dashboard" className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/20">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  GeneGuard AI
                </span>
              </Link>
            </div>

            {/* Middle Search Input (Desktop) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
              <Search size={15} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Right Controls: Notifications, Theme Toggle, Profile Avatar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Dropdown */}
              <NotificationDropdown />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Profile Avatar Link */}
              <Link
                to="/profile"
                title={`Logged in as ${user?.name || 'User'}`}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <span className="hidden xl:inline text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[100px]">
                  {firstName}
                </span>
              </Link>
            </div>
          </header>

          {/* Main Page View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Fixed Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardLayout;

