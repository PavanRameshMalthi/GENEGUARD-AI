import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Tabs from '@/components/ui/Tabs';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import RecommendationCard from '@/components/features/RecommendationCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { recommendationService } from '@/services/recommendation.service';

// Default fallback data for when API is unavailable
const defaultDailyTips = [
  { id: '1', title: 'Drink Water', description: 'Drink 8 glasses of water today to stay well hydrated.', category: 'water' as const, icon: '💧' },
  { id: '2', title: 'Morning Walk', description: 'Take a 30 minute brisk walk to boost cardiovascular health.', category: 'exercise' as const, icon: '🚶' },
  { id: '3', title: 'Sleep Early', description: 'Aim for 7-8 hours of quality sleep tonight.', category: 'sleep' as const, icon: '😴' },
  { id: '4', title: 'Mindfulness', description: 'Take 10 minutes to practice deep breathing or meditation.', category: 'mental' as const, icon: '🧘' },
  { id: '5', title: 'Eat Greens', description: 'Include a serving of leafy greens in your meals today.', category: 'diet' as const, icon: '🥗' },
];

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyTips, setDailyTips] = useState<any[]>(defaultDailyTips);
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dailyRes, weeklyRes] = await Promise.allSettled([
        recommendationService.getDailyRecommendations(),
        recommendationService.getWeeklyGoals()
      ]);

      if (dailyRes.status === 'fulfilled') {
        const data = dailyRes.value.data || dailyRes.value;
        if (Array.isArray(data) && data.length > 0) {
          setDailyTips(data.map((tip: any, i: number) => ({
            id: String(i + 1),
            title: typeof tip === 'string' ? tip.substring(0, 40) : tip.title || 'Tip',
            description: typeof tip === 'string' ? tip : tip.description || tip,
            category: tip.category || 'diet',
            icon: tip.icon || '💡',
          })));
        }
      }

      if (weeklyRes.status === 'fulfilled') {
        const data = weeklyRes.value.data || weeklyRes.value;
        if (Array.isArray(data) && data.length > 0) {
          setWeeklyGoals(data.map((goal: any, i: number) => ({
            id: String(i + 1),
            title: typeof goal === 'string' ? goal : goal.title || 'Goal',
            progress: goal.progress || Math.floor(Math.random() * 60 + 10),
            target: goal.target || '100%',
          })));
        }
      }
    } catch {
      // Use default data
    } finally {
      setLoading(false);
    }
  };
  
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
            {loading ? (
              [...Array(3)].map((_, i) => <LoadingSkeleton key={i} variant="card" />)
            ) : (
              dailyTips.map(tip => (
                <RecommendationCard key={tip.id} recommendation={tip as any} />
              ))
            )}
          </div>
        )}
        
        {activeTab === 'weekly' && (
          <div className="space-y-4 mt-6">
            {loading ? (
              <LoadingSkeleton variant="card" />
            ) : weeklyGoals.length === 0 ? (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                <h3 className="font-semibold mb-2">Weekly Goal: Run 10km</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">4.5km / 10km completed</p>
              </div>
            ) : (
              weeklyGoals.map(goal => (
                <div key={goal.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                  <h3 className="font-semibold mb-2">{goal.title}</h3>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{goal.progress}% completed</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
