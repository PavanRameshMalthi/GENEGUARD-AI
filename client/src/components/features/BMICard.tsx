import React from 'react';
import { Activity } from 'lucide-react';
import { calculateBMI, getBMICategory } from '@/utils/helpers';

interface BMICardProps {
  height: number; // cm
  weight: number; // kg
}

const BMICard: React.FC<BMICardProps> = ({ height, weight }) => {
  const bmi = calculateBMI(height, weight);
  const category = getBMICategory(bmi);

  let categoryColor = 'text-green-500';
  if (category.includes('Underweight') || category.includes('Overweight')) categoryColor = 'text-yellow-500';
  if (category.includes('Obese')) categoryColor = 'text-red-500';

  return (
    <div className="flex items-center gap-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-6 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
        <Activity className="text-primary-600 dark:text-primary-400" size={24} />
      </div>
      <div>
        <h4 className="text-sm text-gray-500 dark:text-gray-400">BMI Index</h4>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{bmi.toFixed(1)}</span>
          <span className={`text-sm font-medium mb-1 ${categoryColor}`}>{category}</span>
        </div>
      </div>
    </div>
  );
};

export default BMICard;
