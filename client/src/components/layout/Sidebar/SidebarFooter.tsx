import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    if (onItemClick) onItemClick();
    logout();
    navigate('/');
  };

  return (
    <div className="p-3 border-t border-gray-200/80 dark:border-gray-800/80">
      <div 
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          className={`flex items-center rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
            isCollapsed 
              ? 'justify-center w-11 h-11 mx-auto p-0' 
              : 'px-3.5 py-2.5 w-full gap-3 text-sm font-medium'
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0, x: -6 }}
                animate={{ opacity: 1, width: 'auto', x: 0 }}
                exit={{ opacity: 0, width: 0, x: -6 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden whitespace-nowrap text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <Tooltip
          content="Logout"
          isVisible={isHovered && isCollapsed}
          position="right"
        />
      </div>
    </div>
  );
};

export default SidebarFooter;
