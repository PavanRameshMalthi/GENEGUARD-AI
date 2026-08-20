import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Tabs from '@/components/ui/Tabs';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import RecommendationCard from '@/components/features/RecommendationCard';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('daily');
  
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Action Plan</h1>
        </div>
        <DisclaimerBanner />
        
        <Tabs 
          tabs={[{ id: 'daily', label: 'Daily Tips' }, { id: 'weekly', label: 'Weekly Goals' }]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        {activeTab === 'daily' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <RecommendationCard recommendation={{ id: '1', title: 'Drink Water', description: 'Drink 8 glasses of water today.', category: 'diet' } as any} />
            <RecommendationCard recommendation={{ id: '2', title: 'Walking', description: 'Take a 30 minute walk.', category: 'exercise' } as any} />
            <RecommendationCard recommendation={{ id: '3', title: 'Sleep Early', description: 'Aim for 8 hours of sleep tonight.', category: 'lifestyle' } as any} />
            <RecommendationCard recommendation={{ id: '4', title: 'Meditation', description: 'Take 10 minutes to meditate.', category: 'mental' } as any} />
            <RecommendationCard recommendation={{ id: '5', title: 'Eat Greens', description: 'Include a salad in your lunch.', category: 'diet' } as any} />
          </div>
        )}
        
        {activeTab === 'weekly' && (
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
              <h3 className="font-semibold mb-2">Weekly Goal: Run 10km</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">4.5km / 10km completed</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
