import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  glass?: boolean;
  title?: string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  className = '',
  children,
  hover = false,
  padding = 'md',
  glass = false,
  title,
  icon,
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = 'rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 transition-all duration-300';
  
  const bgClasses = glass
    ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30'
    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700';

  const renderContent = () => (
    <>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <span className="text-primary-500">{icon}</span>}
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
        </div>
      )}
      {children}
    </>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`${baseClasses} ${bgClasses} ${paddings[padding]} ${className}`}
      >
        {renderContent()}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${bgClasses} ${paddings[padding]} ${className}`}>
      {renderContent()}
    </div>
  );
};

export default Card;
