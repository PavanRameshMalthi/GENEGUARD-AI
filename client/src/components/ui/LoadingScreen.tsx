import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading GeneGuard AI...",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5] 
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative flex items-center justify-center w-24 h-24 mb-6"
      >
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl" />
        <div className="relative flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-900 border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl shadow-primary-500/20">
          <Activity className="w-8 h-8 text-primary-500" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          GeneGuard AI
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
