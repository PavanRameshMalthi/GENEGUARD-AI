import React from 'react';
import { CheckCircle2, AlertCircle, Info, Heart, Activity } from 'lucide-react';
import { Recommendation } from '@/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getIcon = () => {
    switch (recommendation.category) {
      case 'diet': return <Heart className="text-red-500" size={20} />;
      case 'exercise': return <Activity className="text-primary-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="flex gap-4 p-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 hover:-translate-y-1 transition-all duration-300">
      <div className="mt-1 flex-shrink-0">
        <CheckCircle2 className="text-primary-500" size={24} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            {recommendation.category}
          </span>
        </div>
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {recommendation.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {recommendation.description}
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;
