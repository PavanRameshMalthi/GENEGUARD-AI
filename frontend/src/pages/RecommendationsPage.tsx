import React from 'react';
import { Card } from '../components/ui/Card';
import { CheckCircle } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  return (
    <div className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Daily Recommendations</h1>
        <p className="text-slate-600 dark:text-slate-400">General wellness tips based on preventive healthcare standards.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <RecommendationCard title="Exercise" items={['30 minutes of brisk walking', 'Stretching in the morning']} />
        <RecommendationCard title="Nutrition" items={['Eat 5 servings of vegetables', 'Reduce processed sugar']} />
        <RecommendationCard title="Water Intake" items={['Drink at least 2 liters of water daily', 'Avoid sugary drinks']} />
        <RecommendationCard title="Sleep" items={['Aim for 7-8 hours of sleep', 'Maintain a consistent sleep schedule']} />
      </div>
    </div>
  );
};

const RecommendationCard = ({ title, items }: { title: string, items: string[] }) => (
  <Card>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 items-center text-slate-700 dark:text-slate-300">
          <CheckCircle className="w-5 h-5 text-secondary" />
          {item}
        </li>
      ))}
    </ul>
  </Card>
);

export default RecommendationsPage;
