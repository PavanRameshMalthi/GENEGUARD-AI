import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Plus, 
  ClipboardList, 
  Droplet, 
  Moon, 
  Target, 
  FileText, 
  History, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  FileBarChart,
  CheckCircle2
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DynamicHealthScoreCard from '@/components/features/DynamicHealthScoreCard';
import BMICard from '@/components/features/BMICard';
import RiskMeter from '@/components/features/RiskMeter';
import DailyTrackingModal from '@/components/features/DailyTrackingModal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { assessmentService } from '@/services/assessment.service';
import { trackingService } from '@/services/tracking.service';
import { goalService } from '@/services/goal.service';
import { reportService } from '@/services/report.service';
import { scoreService } from '@/services/score.service';
import { timelineService } from '@/services/timeline.service';
import { Assessment, DailyTracking, HealthGoal, Report, DynamicScoreResult, TimelineEvent } from '@/types';
import { getRiskLevelPercent, formatDate } from '@/utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [dynamicScore, setDynamicScore] = useState<DynamicScoreResult | null>(null);
  const [todayTracking, setTodayTracking] = useState<DailyTracking | null>(null);
  const [activeGoals, setActiveGoals] = useState<HealthGoal[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [recentTimeline, setRecentTimeline] = useState<TimelineEvent[]>([]);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        latestRes, 
        allRes, 
        scoreRes, 
        todayRes, 
        goalsRes, 
        reportsRes, 
        timelineRes
      ] = await Promise.allSettled([
        assessmentService.getLatestAssessment(),
        assessmentService.getAssessments(),
        scoreService.getDynamicScore(),
        trackingService.getTodayTracking(),
        goalService.getGoals({ status: 'In Progress' }),
        reportService.getReports({ sort: 'newest' }),
        timelineService.getTimelineEvents({ limit: 5 })
      ]);

      if (latestRes.status === 'fulfilled' && latestRes.value.data) {
        setLatestAssessment(latestRes.value.data);
      }
      if (allRes.status === 'fulfilled' && allRes.value.data) {
        setAssessments(allRes.value.data);
      }
      if (scoreRes.status === 'fulfilled' && scoreRes.value.data) {
        setDynamicScore(scoreRes.value.data);
      }
      if (todayRes.status === 'fulfilled') {
        setTodayTracking(todayRes.value.data || null);
      }
      if (goalsRes.status === 'fulfilled' && goalsRes.value.data) {
        setActiveGoals(goalsRes.value.data.slice(0, 4));
      }
      if (reportsRes.status === 'fulfilled' && reportsRes.value.data) {
        setRecentReports(reportsRes.value.data.slice(0, 3));
      }
      if (timelineRes.status === 'fulfilled' && timelineRes.value.data) {
        setRecentTimeline(timelineRes.value.data.events || []);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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

  const hasAnyHealthData = !!latestAssessment || !!todayTracking || activeGoals.length > 0 || recentReports.length > 0;

  if (!hasAnyHealthData) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name || 'User'}</h1>
          </div>
          <EmptyState
            icon={ClipboardList}
            title="No Health Data Available Yet"
            description="Complete your first health assessment or log your daily tracking to activate dynamic scoring, AI recommendations, and health timelines."
            action={{ label: 'Start Health Assessment', onClick: () => navigate('/assessment') }}
          />
        </motion.div>
      </DashboardLayout>
    );
  }

  const riskPercent = getRiskLevelPercent(dynamicScore?.riskLevel || latestAssessment?.calculations?.riskLevel || 'Moderate');

  const chartData = [...assessments].reverse().map(a => ({
    label: formatDate(a.createdAt),
    score: a.calculations?.healthScore || a.aiAnalysis?.healthScore || 0
  }));

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
        {/* Header with Title and Action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider block mb-1">
              Preventive Healthcare Intelligence
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'User'}
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={() => setIsTrackingModalOpen(true)}
              icon={<Activity size={15} />}
            >
              {todayTracking ? 'Update Tracking' : 'Log Today’s Health'}
            </Button>
            <Link to="/assessment">
              <Button icon={<Plus size={15} />}>
                New Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* Row 1: Core Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dynamicScore && <DynamicHealthScoreCard scoreData={dynamicScore} />}
          
          <BMICard 
            height={latestAssessment?.personalInfo?.height || 0} 
            weight={latestAssessment?.personalInfo?.weight || 0} 
          />

          {/* Today's Hydration & Sleep Quick Widget */}
          <Card glass className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                <span className="flex items-center gap-1"><Droplet size={14} /> Today's Hydration</span>
                <span>{todayTracking ? `${todayTracking.hydration?.waterConsumed} / ${todayTracking.hydration?.waterGoal} L` : 'Not logged'}</span>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                {todayTracking ? `${todayTracking.hydration?.waterConsumed} L` : '—'}
              </div>
              {todayTracking && (
                <ProgressBar
                  progress={Math.min(100, Math.round(((todayTracking.hydration?.waterConsumed || 0) / (todayTracking.hydration?.waterGoal || 2.5)) * 100))}
                  color="#06b6d4"
                  size="sm"
                />
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Moon size={13} className="text-indigo-400" /> Sleep</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {todayTracking ? `${todayTracking.sleep?.totalSleep} hrs` : 'Not logged'}
                </span>
              </div>
            </div>
          </Card>

          <RiskMeter level={riskPercent} label="Dynamic Health Risk" />
        </div>

        {/* Row 2: Today's Tracking & Health Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tracking Card */}
          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-primary-500" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Today's Health Activity</h3>
              </div>
              <Link to="/tracking" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                View Log →
              </Link>
            </div>

            {todayTracking ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block font-semibold">Steps</span>
                  <span className="text-lg font-black text-gray-900 dark:text-white">{todayTracking.physicalActivity?.steps?.toLocaleString() || 0}</span>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block font-semibold">Exercise</span>
                  <span className="text-lg font-black text-gray-900 dark:text-white">{todayTracking.physicalActivity?.exerciseDuration || 0}m</span>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block font-semibold">Stress</span>
                  <span className="text-lg font-black text-gray-900 dark:text-white">{todayTracking.wellness?.stressLevel || 5}/10</span>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block font-semibold">Mood</span>
                  <span className="text-lg font-black capitalize text-gray-900 dark:text-white">{todayTracking.wellness?.mood || 'Good'}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">No daily tracking entry recorded for today yet.</p>
                <Button size="sm" onClick={() => setIsTrackingModalOpen(true)} className="mt-3" icon={<Plus size={14} />}>
                  Log Today
                </Button>
              </div>
            )}
          </Card>

          {/* Active Goals Card */}
          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="text-amber-500" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Active Health Goals</h3>
              </div>
              <Link to="/goals" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Manage Goals →
              </Link>
            </div>

            {activeGoals.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">No active goals in progress.</p>
                <Link to="/goals" className="inline-block mt-3">
                  <Button size="sm" icon={<Plus size={14} />}>Set a Goal</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeGoals.map((goal) => {
                  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100)) || 0;
                  return (
                    <div key={goal._id} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-gray-900 dark:text-white">{goal.title}</span>
                        <span className="text-primary-600 dark:text-primary-400">{goal.current} / {goal.target} {goal.unit} ({pct}%)</span>
                      </div>
                      <ProgressBar progress={pct} size="sm" />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Row 3: Recent Reports & Timeline Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="text-purple-500" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Recent Medical Reports</h3>
              </div>
              <Link to="/reports" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                All Reports →
              </Link>
            </div>

            {recentReports.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">No medical reports uploaded yet.</p>
                <Link to="/reports" className="inline-block mt-3">
                  <Button size="sm" icon={<Plus size={14} />}>Upload Report</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentReports.map((report) => (
                  <div key={report._id} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-xs">{report.fileName}</h4>
                      <span className="text-[11px] text-gray-400">{report.reportType} • {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link to="/reports">
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">View</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Timeline Preview */}
          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="text-primary-500" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Recent Health Timeline</h3>
              </div>
              <Link to="/timeline" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Full Timeline →
              </Link>
            </div>

            {recentTimeline.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">No health timeline events yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentTimeline.map((ev) => (
                  <div key={ev._id} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{ev.title}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-xs">{ev.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(ev.eventDate || ev.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Row 4: Score Trend Chart (Real Stored Assessment Data Only) */}
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

        {/* Daily Tracking Modal */}
        <DailyTrackingModal
          isOpen={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
          onSuccess={fetchDashboardData}
          initialData={todayTracking}
        />
      </motion.div>
    </DashboardLayout>
  );
}
