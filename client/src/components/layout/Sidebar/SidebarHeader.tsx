import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CollapseButton from './CollapseButton';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile
}) => {
  if (isMobile) {
    return (
      <div className="h-16 flex items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 px-4">
        <Link to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-md shadow-primary-500/20 shrink-0">
            <Shield className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white leading-tight">
              GeneGuard <span className="text-primary-500 font-extrabold text-sm">AI</span>
            </span>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Health Intelligence
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // Desktop / Tablet Header
  return (
    <div className={`border-b border-gray-200/80 dark:border-gray-800/80 transition-all duration-300 ${
      isCollapsed ? 'py-3 px-2 flex flex-col items-center gap-2.5' : 'h-16 flex items-center justify-between px-4'
    }`}>
      {/* Brand logo & title */}
      <Link 
        to="/dashboard" 
        aria-label="GeneGuard AI Home"
        className={`flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded-xl p-1 transition-all ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
          <Shield className="h-6 w-6" />
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -10 }}
              animate={{ opacity: 1, width: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, x: -10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col overflow-hidden whitespace-nowrap"
            >
              <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white leading-tight">
                GeneGuard <span className="text-primary-500 font-extrabold text-sm">AI</span>
              </span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Health Intelligence
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Collapse / Expand Toggle Button */}
      <CollapseButton
        isCollapsed={isCollapsed}
        onToggle={onToggleCollapse}
      />
    </div>
  );
};

export default SidebarHeader;
