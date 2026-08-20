import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'bg-primary-500',
  size = 'md',
  animated = true,
  label,
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(value)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${color} ${animated ? 'animate-pulse' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ background: `linear-gradient(90deg, var(--tw-gradient-stops))` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
