import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  glass?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  className = '',
  children,
  hover = false,
  padding = 'md',
  glass = false,
  title,
  subtitle,
  icon,
  action,
  onClick,
}) => {
  const paddings = {
    none: '',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const baseClasses = 'rounded-2xl border transition-all duration-200';
  
  const bgClasses = glass
    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 shadow-sm'
    : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800/80 shadow-sm shadow-slate-200/40 dark:shadow-none';

  const renderContent = () => (
    <>
      {(title || icon || action) && (
        <div className="flex items-start justify-between gap-3 mb-4 pb-1">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-indigo-600 dark:text-indigo-400 shrink-0">{icon}</span>}
            <div>
              {title && <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        onClick={onClick}
        className={`${baseClasses} ${bgClasses} ${paddings[padding]} ${className}`}
      >
        {renderContent()}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={`${baseClasses} ${bgClasses} ${paddings[padding]} ${className}`}>
      {renderContent()}
    </div>
  );
};

export default Card;
