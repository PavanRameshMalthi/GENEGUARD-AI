import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HealthScoreCard from '@/components/features/HealthScoreCard';
import BMICard from '@/components/features/BMICard';
import RiskMeter from '@/components/features/RiskMeter';
import AssessmentCard from '@/components/features/AssessmentCard';
import RecommendationCard from '@/components/features/RecommendationCard';
import HealthScoreChart from '@/components/charts/HealthScoreChart';
import ExerciseChart from '@/components/charts/ExerciseChart';
import SleepChart from '@/components/charts/SleepChart';
import WaterIntakeChart from '@/components/charts/WaterIntakeChart';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}</h1>
          <div className="flex gap-3">
            <Link to="/assessment">
              <Button icon={<Plus size={16} />}>New Assessment</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} variant="card" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <HealthScoreCard score={85} trend="up" />
            <BMICard height={175} weight={70} />
            <Card glass className="p-4 flex flex-col justify-center items-center text-center">
              <Activity className="text-primary-500 mb-2" size={32} />
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-gray-500">Total Assessments</div>
            </Card>
            <RiskMeter level={20} label="Overall Risk" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card glass title="Health Trend"><HealthScoreChart score={85} /></Card>
          <Card glass title="Activity Levels"><ExerciseChart data={[]} /></Card>
          <Card glass title="Sleep Pattern"><SleepChart data={[]} /></Card>
          <Card glass title="Hydration"><WaterIntakeChart data={[]} /></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card glass title="Recent Assessments">
             <div className="text-gray-500 text-center py-4">No recent assessments. Start one!</div>
          </Card>
          <Card glass title="Daily Recommendations">
            <div className="space-y-3">
              <RecommendationCard recommendation={{ id: '1', title: 'Hydrate!', description: 'Drink 2 more glasses of water.', category: 'diet', priority: 'medium' } as any} />
              <RecommendationCard recommendation={{ id: '2', title: 'Move', description: 'Take a 15-minute walk.', category: 'exercise', priority: 'medium' } as any} />
            </div>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
