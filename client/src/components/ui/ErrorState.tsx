import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 text-center bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl ${className}`}
    >
      <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-300 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorState;
