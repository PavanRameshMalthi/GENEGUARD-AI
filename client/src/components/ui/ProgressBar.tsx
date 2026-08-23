import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value?: number;
  progress?: number;
  color?: 'primary' | 'accent' | 'green' | 'red' | 'yellow' | string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  label?: string;
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  green: 'bg-emerald-500',
  red: 'bg-rose-500',
  yellow: 'bg-amber-500',
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  progress,
  color = 'primary',
  size = 'md',
  animated = true,
  label,
}) => {
  const actualValue = Math.min(100, Math.max(0, value !== undefined ? value : (progress !== undefined ? progress : 0)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const isPredefinedColor = typeof color === 'string' && colorMap[color];
  const bgColorClass = isPredefinedColor ? colorMap[color] : 'bg-primary-500';
  const customStyle = !isPredefinedColor && typeof color === 'string' && color.startsWith('#')
    ? { backgroundColor: color }
    : undefined;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(actualValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${bgColorClass}`}
          style={customStyle}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${actualValue}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
