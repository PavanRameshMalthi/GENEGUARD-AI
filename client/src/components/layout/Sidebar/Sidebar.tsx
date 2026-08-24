import React, { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bot,
  Calendar,
  Dna,
  Trophy,
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
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Bot, label: 'AI Assistant', path: '/copilot', badge: 'AI', badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' },
    { icon: Dna, label: 'Genetics', path: '/genetics' },
    { icon: Activity, label: 'Analysis', path: '/analysis' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: History, label: 'History', path: '/timeline' },
  ];

  const adminItems = [
    { icon: Shield, label: 'Admin Dashboard', path: '/admin', badge: 'Admin', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  ];

  const renderNavList = (isMobile = false) => (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3 space-y-3 custom-scrollbar">
      {/* Main Section */}
      <div>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5"
            >
              Main Navigation
            </motion.p>
          )}
        </AnimatePresence>
        <div className="space-y-0.5">
          {navItems.map((item) => (
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

      {/* Admin Section (if admin) */}
      {user?.role === 'admin' && (
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="px-3 text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-1.5"
              >
                Admin Management
              </motion.p>
            )}
          </AnimatePresence>
          <div className="space-y-0.5">
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
          width: isCollapsed ? 76 : 256,
        }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="hidden lg:flex flex-col shrink-0 min-h-full bg-white/95 dark:bg-[#090d1f]/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors relative z-10"
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
              className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              aria-label="Mobile Navigation Drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white dark:bg-[#090d1f] shadow-2xl border-r border-slate-200 dark:border-slate-800 lg:hidden"
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
