import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Tooltip from './Tooltip';

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isCollapsed: boolean;
  badge?: string | number;
  badgeColor?: string;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  path,
  isCollapsed,
  badge,
  badgeColor = 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  onClick
}) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <div
      className="relative my-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink
        to={path}
        onClick={onClick}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        className={`group relative flex items-center rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
          isCollapsed ? 'justify-center w-11 h-11 mx-auto p-0' : 'px-3.5 py-2.5 w-full gap-3'
        } ${
          isActive
            ? 'bg-primary-600 dark:bg-primary-500 text-white font-semibold shadow-lg shadow-primary-500/25'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        {/* Active Pill indicator on left for expanded mode */}
        {isActive && !isCollapsed && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-white"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}

        {/* Icon */}
        <Icon
          className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
            isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
          }`}
        />

        {/* Label & Badge (Animated for collapse/expand) */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -6 }}
              animate={{ opacity: 1, width: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, x: -6 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-between flex-1 overflow-hidden whitespace-nowrap"
            >
              <span className="text-sm font-medium tracking-normal truncate">{label}</span>
              {badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </NavLink>

      {/* Floating tooltip in collapsed mode */}
      <Tooltip
        content={label}
        isVisible={isHovered && isCollapsed}
        position="right"
      />
    </div>
  );
};

export default SidebarItem;
