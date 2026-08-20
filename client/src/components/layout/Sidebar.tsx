import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, MessageSquare, FileText, Heart, User, Settings, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth() || { user: { role: 'user', name: 'Guest', email: 'guest@example.com', avatar: '' } };
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ClipboardList, label: 'Assessment', path: '/assessment' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Heart, label: 'Recommendations', path: '/recommendations' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const adminItems = [
    { icon: Shield, label: 'Admin Dashboard', path: '/admin' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/30">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-500">
          <Shield className="h-8 w-8" />
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden md:block lg:block">GeneGuard</span>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-500' : ''}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {user?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Admin</p>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
