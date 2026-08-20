import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';

interface HealthScoreCardProps {
  score: number;
  trend?: 'up' | 'down' | 'stable';
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ score, trend }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Overall Health Score</h3>
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            className="text-gray-200 dark:text-gray-700 stroke-current"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            className="text-primary-500 stroke-current"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            initial={{ strokeDasharray: "0 440" }}
            animate={{ strokeDasharray: `${(score / 100) * 440} 440` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {animatedScore}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {trend === 'up' && <TrendingUp className="text-green-500" size={24} />}
        {trend === 'down' && <TrendingDown className="text-red-500" size={24} />}
        {trend === 'stable' && <Minus className="text-gray-500" size={24} />}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
        </span>
      </div>
    </Card>
  );
};

export default HealthScoreCard;
