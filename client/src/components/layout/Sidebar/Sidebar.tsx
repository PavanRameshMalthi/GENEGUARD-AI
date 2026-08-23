import React, { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity,
  History,
  Target,
  FileText,
  FileBarChart,
  ClipboardList, 
  MessageSquare, 
  Heart, 
  User, 
  Settings, 
  Shield 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/context/SidebarContext';
import SidebarHeader from './SidebarHeader';
import SidebarItem from './SidebarItem';
import SidebarFooter from './SidebarFooter';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobile } = useSidebar();

  // Keyboard shortcut Ctrl+\ or Cmd+\ to toggle collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCollapse]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Activity, label: 'Daily Tracking', path: '/tracking' },
    { icon: History, label: 'Health Timeline', path: '/timeline' },
    { icon: Target, label: 'Health Goals', path: '/goals' },
    { icon: FileText, label: 'Medical Reports', path: '/reports' },
    { icon: FileBarChart, label: 'Weekly Reports', path: '/weekly-reports' },
    { icon: ClipboardList, label: 'Assessment', path: '/assessment' },
    { icon: MessageSquare, label: 'AI Chat', path: '/chat', badge: 'AI' },
    { icon: Heart, label: 'Recommendations', path: '/recommendations' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const adminItems = [
    { icon: Shield, label: 'Admin Dashboard', path: '/admin', badge: 'Admin', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  ];

  const renderNavList = (isMobile = false) => (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-4 custom-scrollbar">
      {/* Main Section */}
      <div>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="px-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5"
            >
              Main Menu
            </motion.p>
          )}
        </AnimatePresence>
        <div className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              badge={item.badge}
              isCollapsed={isMobile ? false : isCollapsed}
              onClick={isMobile ? closeMobile : undefined}
            />
          ))}
        </div>
      </div>

      {/* Admin Section (if admin) */}
      {user?.role === 'admin' && (
        <div className="pt-2 border-t border-gray-200/60 dark:border-gray-800/60">
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="px-3.5 text-[11px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-wider mb-1.5"
              >
                Administration
              </motion.p>
            )}
          </AnimatePresence>
          <div className="space-y-1">
            {adminItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                badge={item.badge}
                badgeColor={item.badgeColor}
                isCollapsed={isMobile ? false : isCollapsed}
                onClick={isMobile ? closeMobile : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <motion.aside
        aria-label="Sidebar Navigation"
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
        }}
        transition={{
          duration: 0.28,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-30 bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-r border-gray-200/80 dark:border-gray-800/80 shadow-sm transition-colors"
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        {renderNavList(false)}
        <SidebarFooter
          isCollapsed={isCollapsed}
        />
      </motion.aside>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              aria-label="Mobile Navigation Drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 md:hidden"
            >
              <SidebarHeader
                isCollapsed={false}
                onToggleCollapse={() => {}}
                isMobile={true}
                onCloseMobile={closeMobile}
              />
              {renderNavList(true)}
              <SidebarFooter
                isCollapsed={false}
                onItemClick={closeMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
