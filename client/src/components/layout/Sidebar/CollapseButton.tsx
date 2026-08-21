import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

interface CollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export const CollapseButton: React.FC<CollapseButtonProps> = ({ 
  isCollapsed, 
  onToggle,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip
        content={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        isVisible={isHovered}
        position="right"
      >
        <motion.button
          type="button"
          onClick={onToggle}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.06 }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          className={`flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
            isCollapsed ? 'w-10 h-10' : 'p-2'
          }`}
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-primary-600 dark:text-primary-400" />
          ) : (
            <ChevronLeft size={18} />
          )}
        </motion.button>
      </Tooltip>
    </div>
  );
};

export default CollapseButton;
