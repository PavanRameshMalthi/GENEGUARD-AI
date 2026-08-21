import React from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/context/SidebarContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const { openMobile } = useSidebar();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex transition-colors duration-300 antialiased selection:bg-primary-500 selection:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden transition-all duration-300">
        {/* Top Navbar / Header */}
        <header className="bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-20 transition-all duration-300">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={openMobile}
              aria-label="Open navigation menu"
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3.5">
            <ThemeToggle />
            <div 
              title={user?.name || 'User'}
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white font-bold text-sm shadow-md shadow-primary-500/20 ring-2 ring-white dark:ring-gray-800"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>
        
        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
