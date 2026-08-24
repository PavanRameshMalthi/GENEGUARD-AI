import React, { useState } from 'react';
import { Menu, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
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

  const isDashboardHome = location.pathname === '/dashboard';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <div className="min-h-screen bg-slate-100/80 dark:bg-[#060913] bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,rgba(99,102,241,0.08),rgba(241,245,249,0))] dark:bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,rgba(79,70,229,0.18),rgba(6,9,19,0))] flex flex-col items-center justify-center p-0 lg:p-6 transition-colors duration-200 relative overflow-x-hidden antialiased selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glow effects */}
      <div className="hidden lg:block absolute top-12 left-12 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden lg:block absolute bottom-12 right-12 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Elevated Dashboard Container */}
      <div className="w-full lg:max-w-[1540px] min-h-screen lg:min-h-[calc(100vh-48px)] my-0 lg:my-auto bg-white dark:bg-[#0c1022]/98 lg:rounded-[32px] border-0 lg:border border-slate-200/80 dark:border-indigo-950/50 shadow-none lg:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] dark:lg:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] flex flex-row overflow-hidden backdrop-blur-xl relative transition-all duration-200">
        
        {/* Left Collapsible Sidebar */}
        <Sidebar />

        {/* Main Content & Header Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-full overflow-y-auto custom-scrollbar transition-all duration-200">
          {/* Top Dashboard Header */}
          <header className="bg-white/95 dark:bg-[#0d1226]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/70 min-h-[72px] flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-20 transition-all duration-200">
            {/* Left Header Greeting / Title */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={openMobile}
                aria-label="Open navigation menu"
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div>
                {isDashboardHome ? (
                  <>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {greeting}, <span className="text-indigo-600 dark:text-indigo-400">{firstName}</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                      Here's your health overview for today.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {title || 'Dashboard'}
                    </h1>
                    {subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                        {subtitle}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Header Actions: Search, Notifications, Theme, Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Modern Search Box */}
              <div className="hidden md:flex items-center relative">
                <Search size={16} className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search health records, reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 lg:w-64 pl-9 pr-4 py-1.5 rounded-xl text-xs bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Notification Dropdown */}
              <NotificationDropdown />

              {/* Theme Switcher */}
              <ThemeToggle />

              {/* User Profile Avatar Link */}
              <Link
                to="/profile"
                title={`Logged in as ${user?.name || 'User'}`}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={15} />}
                </div>
                <span className="hidden xl:inline text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[100px]">
                  {firstName}
                </span>
              </Link>
            </div>
          </header>

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

