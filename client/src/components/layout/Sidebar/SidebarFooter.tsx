import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Tooltip from './Tooltip';

interface SidebarFooterProps {
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed, onItemClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    if (onItemClick) onItemClick();
    try {
      logout();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const footerItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="p-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
      {footerItems.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <NavLink
            to={item.path}
            onClick={onItemClick}
            aria-label={item.label}
            className={({ isActive }) =>
              `group relative flex items-center rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 ${
                isCollapsed ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2 w-full gap-3 h-10'
              } ${
                isActive && item.path === '/settings'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0, x: -6 }}
                  animate={{ opacity: 1, width: 'auto', x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -6 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden whitespace-nowrap text-xs font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>

          <Tooltip
            content={item.label}
            isVisible={hoveredItem === item.label && isCollapsed}
            position="right"
          />
        </div>
      ))}

      {/* Logout Option - Visually separated at bottom */}
      <div
        className="relative pt-1 border-t border-slate-100 dark:border-slate-800/60"
        onMouseEnter={() => setHoveredItem('Logout')}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Logout"
          className={`group relative flex items-center rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 cursor-pointer ${
            isCollapsed ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2 w-full gap-3 h-10'
          } text-slate-600 dark:text-slate-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400`}
        >
          {isLoggingOut ? (
            <Loader2 className="h-4.5 w-4.5 shrink-0 animate-spin text-rose-500" />
          ) : (
            <LogOut className="h-4.5 w-4.5 shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
          )}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0, x: -6 }}
                animate={{ opacity: 1, width: 'auto', x: 0 }}
                exit={{ opacity: 0, width: 0, x: -6 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden whitespace-nowrap text-xs font-medium"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <Tooltip
          content="Logout"
          isVisible={hoveredItem === 'Logout' && isCollapsed}
          position="right"
        />
      </div>
    </div>
  );
};

export default SidebarFooter;
