import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HealthScoreCard from '@/components/features/HealthScoreCard';
import BMICard from '@/components/features/BMICard';
import RiskMeter from '@/components/features/RiskMeter';
import RecommendationCard from '@/components/features/RecommendationCard';
import HealthScoreChart from '@/components/charts/HealthScoreChart';
import ExerciseChart from '@/components/charts/ExerciseChart';
import SleepChart from '@/components/charts/SleepChart';
import WaterIntakeChart from '@/components/charts/WaterIntakeChart';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { assessmentService } from '@/services/assessment.service';

// Demo chart data
const demoExerciseData = [
  { day: 'Mon', minutes: 30 }, { day: 'Tue', minutes: 45 }, { day: 'Wed', minutes: 20 },
  { day: 'Thu', minutes: 60 }, { day: 'Fri', minutes: 35 }, { day: 'Sat', minutes: 50 }, { day: 'Sun', minutes: 40 }
];
const demoSleepData = [
  { day: 'Mon', hours: 7 }, { day: 'Tue', hours: 6.5 }, { day: 'Wed', hours: 8 },
  { day: 'Thu', hours: 7.5 }, { day: 'Fri', hours: 6 }, { day: 'Sat', hours: 9 }, { day: 'Sun', hours: 7.5 }
];
const demoWaterData = [
  { day: 'Mon', glasses: 6 }, { day: 'Tue', glasses: 8 }, { day: 'Wed', glasses: 5 },
  { day: 'Thu', glasses: 7 }, { day: 'Fri', glasses: 9 }, { day: 'Sat', glasses: 6 }, { day: 'Sun', glasses: 8 }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [latestScore, setLatestScore] = useState(85);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await assessmentService.getAssessments();
        const assessments = res.data || [];
        setAssessmentCount(Array.isArray(assessments) ? assessments.length : 0);
        if (Array.isArray(assessments) && assessments.length > 0) {
          const latest = assessments[0];
          if (latest?.aiAnalysis?.healthScore) {
            setLatestScore(latest.aiAnalysis.healthScore);
          }
        }
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
            <HealthScoreCard score={latestScore} trend="up" />
            <BMICard height={user?.profile?.height || 175} weight={user?.profile?.weight || 70} />
            <Card glass className="p-4 flex flex-col justify-center items-center text-center">
              <Activity className="text-primary-500 mb-2" size={32} />
              <div className="text-3xl font-bold">{assessmentCount}</div>
              <div className="text-sm text-gray-500">Total Assessments</div>
            </Card>
            <RiskMeter level={20} label="Overall Risk" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card glass title="Health Trend"><HealthScoreChart score={latestScore} /></Card>
          <Card glass title="Activity Levels"><ExerciseChart data={demoExerciseData} /></Card>
          <Card glass title="Sleep Pattern"><SleepChart data={demoSleepData} /></Card>
          <Card glass title="Hydration"><WaterIntakeChart data={demoWaterData} /></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card glass title="Recent Assessments">
            {assessmentCount === 0 ? (
              <div className="text-gray-500 text-center py-4">No recent assessments. Start one!</div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                You have {assessmentCount} assessment{assessmentCount !== 1 ? 's' : ''}. <Link to="/assessment" className="text-primary-500 hover:underline">View all</Link>
              </div>
            )}
          </Card>
          <Card glass title="Daily Recommendations">
            <div className="space-y-3">
              <RecommendationCard recommendation={{ id: '1', title: 'Hydrate!', description: 'Drink 2 more glasses of water.', category: 'water', icon: '💧' } as any} />
              <RecommendationCard recommendation={{ id: '2', title: 'Move', description: 'Take a 15-minute walk.', category: 'exercise', icon: '🚶' } as any} />
            </div>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
