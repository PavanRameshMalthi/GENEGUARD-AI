import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value?: number;
  progress?: number;
  color?: 'primary' | 'accent' | 'green' | 'red' | 'yellow' | string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  label?: string;
  className?: string;
}

const colorMap: Record<string, string> = {
  primary: 'bg-indigo-600 dark:bg-indigo-500',
  indigo: 'bg-indigo-600 dark:bg-indigo-500',
  accent: 'bg-indigo-500',
  green: 'bg-emerald-500 dark:bg-emerald-400',
  emerald: 'bg-emerald-500 dark:bg-emerald-400',
  teal: 'bg-teal-500 dark:bg-teal-400',
  cyan: 'bg-cyan-500 dark:bg-cyan-400',
  red: 'bg-rose-500 dark:bg-rose-400',
  rose: 'bg-rose-500 dark:bg-rose-400',
  yellow: 'bg-amber-500 dark:bg-amber-400',
  amber: 'bg-amber-500 dark:bg-amber-400',
  purple: 'bg-purple-500 dark:bg-purple-400',
  blue: 'bg-blue-500 dark:bg-blue-400'
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  progress,
  color = 'primary',
  size = 'md',
  animated = true,
  label,
  className = '',
}) => {
  const actualValue = Math.min(100, Math.max(0, value !== undefined ? value : (progress !== undefined ? progress : 0)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3.5',
  };

  const isPredefinedColor = typeof color === 'string' && colorMap[color];
  const bgColorClass = isPredefinedColor ? colorMap[color] : (typeof color === 'string' && color.startsWith('bg-') ? color : 'bg-indigo-600');
  const customStyle = !isPredefinedColor && typeof color === 'string' && color.startsWith('#')
    ? { backgroundColor: color }
    : undefined;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{Math.round(actualValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
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
