import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Plus, ClipboardList } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HealthScoreCard from '@/components/features/HealthScoreCard';
import BMICard from '@/components/features/BMICard';
import RiskMeter from '@/components/features/RiskMeter';
import HealthScoreChart from '@/components/charts/HealthScoreChart';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { assessmentService } from '@/services/assessment.service';
import { Assessment } from '@/types';
import { getRiskLevelPercent, formatDate } from '@/utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, allRes] = await Promise.allSettled([
          assessmentService.getLatestAssessment(),
          assessmentService.getAssessments()
        ]);
        
        if (latestRes.status === 'fulfilled') {
          const res = latestRes.value;
          setLatestAssessment(res.data || res);
        }
        
        if (allRes.status === 'fulfilled') {
          const res = allRes.value;
          setAssessments(res.data || res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} variant="card" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      </DashboardLayout>
    );
  }

  if (!latestAssessment) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}</h1>
          </div>
          <EmptyState
            icon={ClipboardList}
            title="No Health Assessment Found"
            description="Complete your first assessment to receive personalized AI-powered health insights, recommendations, and tracking."
            action={{ label: 'Start Assessment', onClick: () => navigate('/assessment') }}
          />
        </motion.div>
      </DashboardLayout>
    );
  }

  const prevAssessment = assessments.length > 1 ? assessments[1] : null;
  const currentScore = latestAssessment.calculations?.healthScore || latestAssessment.aiAnalysis?.healthScore || 0;
  const prevScore = prevAssessment?.calculations?.healthScore || prevAssessment?.aiAnalysis?.healthScore || 0;
  const trend = currentScore >= prevScore ? 'up' : 'down';
  
  const riskPercent = getRiskLevelPercent(latestAssessment.calculations?.riskLevel || 'Moderate');
  
  // Prepare chart data (reverse to show chronological order)
  const chartData = [...assessments].reverse().map(a => ({
    label: formatDate(a.createdAt),
    score: a.calculations?.healthScore || a.aiAnalysis?.healthScore || 0
  }));

  const recommendations = [
    ...(latestAssessment.aiAnalysis?.lifestyleImprovements || []),
    ...(latestAssessment.aiAnalysis?.weeklyGoals || [])
  ].slice(0, 3);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthScoreCard score={currentScore} trend={trend} />
          <BMICard height={latestAssessment.personalInfo?.height || 0} weight={latestAssessment.personalInfo?.weight || 0} />
          <Card glass className="p-4 flex flex-col justify-center items-center text-center">
            <Activity className="text-primary-500 mb-2" size={32} />
            <div className="text-3xl font-bold">{assessments.length}</div>
            <div className="text-sm text-gray-500">Total Assessments</div>
          </Card>
          <RiskMeter level={riskPercent} label="Overall Risk" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Weight</div>
            <div className="font-semibold">{latestAssessment.personalInfo?.weight} kg</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Sleep</div>
            <div className="font-semibold">{latestAssessment.lifestyle?.sleepHours} hrs</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Hydration</div>
            <div className="font-semibold">{latestAssessment.lifestyle?.dailyWaterIntake} / {latestAssessment.calculations?.dailyWaterRequirement} L</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Stress</div>
            <div className="font-semibold">{latestAssessment.lifestyle?.stressLevel} / 10</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Activity Level</div>
            <div className="font-semibold text-sm truncate">{latestAssessment.calculations?.activityLevel || 'N/A'}</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Exercise</div>
            <div className="font-semibold text-sm truncate">{latestAssessment.physicalActivity?.exerciseFrequency || 'N/A'}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card glass title="Recent Assessment">
            <div className="space-y-4">
              <div className="text-sm text-gray-500">Date: {formatDate(latestAssessment.createdAt)}</div>
              {latestAssessment.aiAnalysis && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {latestAssessment.aiAnalysis.overallHealthSummary}
                </p>
              )}
              <Link to={`/assessment/${latestAssessment._id}`}>
                <Button variant="outline" className="w-full mt-2">View Full Result</Button>
              </Link>
            </div>
          </Card>
          
          <Card glass title="AI Recommendations Preview">
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm border border-gray-100 dark:border-gray-700">
                    {rec}
                  </div>
                ))}
                <Link to="/recommendations" className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-2">
                  View All Recommendations
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recommendations available.</p>
            )}
          </Card>
        </div>
        
        {assessments.length > 1 && (
          <Card glass title="Health Score Trend">
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="label" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
