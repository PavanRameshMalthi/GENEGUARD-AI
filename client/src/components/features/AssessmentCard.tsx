import React from 'react';
import { ChevronRight, Calendar } from 'lucide-react';
import { Assessment } from '@/types';

interface AssessmentCardProps {
  assessment: Assessment;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-6 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 group cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/70 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Calendar size={16} />
          <span className="text-sm">{new Date(assessment.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">
          Score: {assessment.aiAnalysis?.healthScore || 'N/A'}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Health Assessment
      </h3>

      <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
        View full results <ChevronRight size={16} className="ml-1" />
      </div>
    </div>
  );
};

export default AssessmentCard;
