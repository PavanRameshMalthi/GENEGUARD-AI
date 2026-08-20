import React from 'react';
import { motion } from 'framer-motion';

interface RiskMeterProps {
  level: number; // 0-100
  label?: string;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ level, label = 'Risk Level' }) => {
  const getColor = (val: number) => {
    if (val < 33) return 'bg-green-500';
    if (val < 66) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const colorClass = getColor(level);

  return (
    <div className="w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{level}%</span>
      </div>
      <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`absolute top-0 left-0 h-full rounded-full ${colorClass}`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default RiskMeter;
