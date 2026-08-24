import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingDown,
  Minus,
  FileBarChart,
  CheckCircle2,
  Apple,
  Heart,
  Flame,
  Bot,
  Calendar,
  ChevronRight,
  Info,
  ShieldAlert,
  Zap
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DailyTrackingModal from '@/components/features/DailyTrackingModal';
import Button from '@/components/ui/Button';
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
import { calculateBMI, getBMICategory, formatDate } from '@/utils/helpers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [showSubScores, setShowSubScores] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState<'7d' | '30d' | '3m'>('30d');

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

      if (latestRes.status === 'fulfilled' && latestRes.value?.data) {
        setLatestAssessment(latestRes.value.data);
      }
      if (allRes.status === 'fulfilled' && allRes.value?.data) {
        setAssessments(allRes.value.data);
      }
      if (scoreRes.status === 'fulfilled' && scoreRes.value?.data) {
        setDynamicScore(scoreRes.value.data);
      }
      if (todayRes.status === 'fulfilled') {
        setTodayTracking(todayRes.value?.data || null);
      }
      if (goalsRes.status === 'fulfilled' && goalsRes.value?.data) {
        setActiveGoals(goalsRes.value.data.slice(0, 4));
      }
      if (reportsRes.status === 'fulfilled' && reportsRes.value?.data) {
        setRecentReports(reportsRes.value.data.slice(0, 3));
      }
      if (timelineRes.status === 'fulfilled' && timelineRes.value?.data) {
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

  // Filter assessment data for the chart based on selected timeframe
  const filteredChartData = useMemo(() => {
    if (!assessments || assessments.length === 0) return [];
    
    let sorted = [...assessments].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const now = new Date().getTime();
    if (chartTimeframe === '7d') {
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const recent = sorted.filter(a => new Date(a.createdAt).getTime() >= sevenDaysAgo);
      if (recent.length >= 2) sorted = recent;
      else sorted = sorted.slice(-7);
    } else if (chartTimeframe === '30d') {
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      const recent = sorted.filter(a => new Date(a.createdAt).getTime() >= thirtyDaysAgo);
      if (recent.length >= 2) sorted = recent;
      else sorted = sorted.slice(-15);
    } else {
      const threeMonthsAgo = now - 90 * 24 * 60 * 60 * 1000;
      const recent = sorted.filter(a => new Date(a.createdAt).getTime() >= threeMonthsAgo);
      if (recent.length >= 2) sorted = recent;
    }

    return sorted.map(a => ({
      date: formatDate(a.createdAt),
      score: a.calculations?.healthScore || a.aiAnalysis?.healthScore || 0
    }));
  }, [assessments, chartTimeframe]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => <LoadingSkeleton key={i} variant="card" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
            <div className="space-y-6">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasAnyHealthData = !!latestAssessment || !!todayTracking || activeGoals.length > 0 || recentReports.length > 0;

  if (!hasAnyHealthData) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto py-8">
          <div className="text-center space-y-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
              GeneGuard AI Platform
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome to your Health Command Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Get started by completing your clinical health assessment or logging your daily biometrics to activate dynamic scoring and Gemini AI insights.
            </p>
          </div>
          <EmptyState
            icon={ClipboardList}
            title="No Health Data Recorded Yet"
            description="Complete your first health assessment to calculate your real-time health score, unlock biological age metrics, and receive proactive lifestyle guidance."
            action={{ label: 'Start Health Assessment', onClick: () => navigate('/assessment') }}
          />
        </motion.div>
      </DashboardLayout>
    );
  }

  // Calculate BMI safely
  const height = latestAssessment?.personalInfo?.height || 0;
  const weight = latestAssessment?.personalInfo?.weight || 0;
  const bmiValue = height && weight ? calculateBMI(height, weight) : 0;
  const bmiCategory = bmiValue ? getBMICategory(bmiValue) : '';

  // Real Score Values
  const currentScore = dynamicScore?.overallScore ?? latestAssessment?.calculations?.healthScore ?? 0;
  const riskLevel = dynamicScore?.riskLevel || latestAssessment?.calculations?.riskLevel || 'Low';
  const scoreDelta = dynamicScore?.scoreChange ?? 0;

  // Real Hydration Values
  const waterConsumed = todayTracking?.hydration?.waterConsumed;
  const waterGoal = todayTracking?.hydration?.waterGoal || 2.5;
  const waterPct = waterConsumed !== undefined ? Math.min(100, Math.round((waterConsumed / waterGoal) * 100)) : 0;

  // Real Sleep Values
  const sleepTotal = todayTracking?.sleep?.totalSleep;
  const sleepGoal = todayTracking?.sleep?.sleepGoal || 8.0;
  const sleepPct = sleepTotal !== undefined ? Math.min(100, Math.round((sleepTotal / sleepGoal) * 100)) : 0;

  // Real Activity Values
  const stepsCount = todayTracking?.physicalActivity?.steps;
  const exerciseDuration = todayTracking?.physicalActivity?.exerciseDuration || 0;
  const stepsPct = stepsCount !== undefined ? Math.min(100, Math.round((stepsCount / 8000) * 100)) : 0;

  // Custom Dark Tooltip Component for Chart
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white px-3.5 py-2 rounded-xl shadow-2xl text-xs font-semibold border border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
            <span className="text-slate-300">{label}:</span>
            <span className="text-white font-bold text-sm">{payload[0].value} pts</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">

        {/* 1. TOP HEADER BANNER: Action Buttons & Clinical Engine Tag */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} className="animate-pulse" />
              <span>Preventive Health Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Biometric Overview & Analysis
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              onClick={() => setIsTrackingModalOpen(true)}
              icon={<Activity size={15} />}
              className="bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-750"
            >
              {todayTracking ? 'Update Today\'s Log' : 'Log Today\'s Health'}
            </Button>
            <Link to="/assessment">
              <Button icon={<Plus size={15} />} className="text-xs font-semibold">
                New Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. TOP ROW: 5 SYMMETRICAL HEALTH METRIC CARDS (INSPIRED BY REFERENCE DESIGN) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* CARD 1: HERO HEALTH SCORE CARD (HIGHLIGHTED IN INDIGO/PURPLE GRADIENT) */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-2xl p-5 shadow-lg shadow-indigo-600/25 relative overflow-hidden flex flex-col justify-between group">
            {/* Ambient inner soft highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-indigo-100 mb-2">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  <Zap size={14} className="text-yellow-300" /> Health Score
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm">
                  {riskLevel} Risk
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-4xl font-black tracking-tight text-white">
                  {currentScore > 0 ? currentScore : '—'}
                </span>
                <span className="text-xs text-indigo-200 font-semibold">/ 100</span>

                {scoreDelta !== 0 && (
                  <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                    {scoreDelta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, currentScore))}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowSubScores(!showSubScores)}
                className="w-full text-[11px] text-indigo-100 hover:text-white font-semibold flex items-center justify-between transition-colors"
              >
                <span>{showSubScores ? 'Hide Breakdown' : 'Sub-Score Breakdown'}</span>
                <ChevronRight size={14} className={`transform transition-transform ${showSubScores ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>

          {/* CARD 2: BMI INDEX CARD */}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
                  <Activity size={14} className="text-emerald-500" /> BMI Index
                </span>
                {bmiCategory && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
                    {bmiCategory}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {bmiValue ? bmiValue.toFixed(1) : '—'}
                </span>
                <span className="text-xs text-slate-400 font-medium">kg/m²</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
              {height && weight ? (
                <div className="flex justify-between items-center text-[11px]">
                  <span>Height: {height} cm</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Weight: {weight} kg</span>
                </div>
              ) : (
                <span className="text-[11px]">No height/weight data yet</span>
              )}
            </div>
          </div>

          {/* CARD 3: HYDRATION CARD */}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  <Droplet size={14} /> Hydration
                </span>
                <span className="text-[11px] font-bold">
                  {waterConsumed !== undefined ? `${waterPct}%` : '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {waterConsumed !== undefined ? waterConsumed : '—'}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ {waterGoal} L</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <ProgressBar progress={waterPct} color="#06b6d4" size="sm" />
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1.5">
                <span>Consumed</span>
                <span>{waterConsumed !== undefined ? `${(waterGoal - waterConsumed > 0 ? (waterGoal - waterConsumed).toFixed(1) : 0)} L left` : 'Not logged'}</span>
              </div>
            </div>
          </div>

          {/* CARD 4: SLEEP CARD */}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  <Moon size={14} /> Sleep
                </span>
                <span className="text-[11px] font-bold">
                  {sleepTotal !== undefined ? `${sleepPct}%` : '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {sleepTotal !== undefined ? sleepTotal : '—'}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ {sleepGoal} hrs</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <ProgressBar progress={sleepPct} color="#6366f1" size="sm" />
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1.5">
                <span>{todayTracking?.sleep?.bedtime ? `${todayTracking.sleep.bedtime} - ${todayTracking.sleep.wakeUpTime}` : 'Bedtime'}</span>
                <span>{sleepTotal !== undefined ? `${sleepTotal}h logged` : 'Not logged'}</span>
              </div>
            </div>
          </div>

          {/* CARD 5: PHYSICAL ACTIVITY CARD */}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  <Flame size={14} /> Movement
                </span>
                <span className="text-[11px] font-bold">
                  {stepsCount !== undefined ? `${stepsPct}%` : '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {stepsCount !== undefined ? stepsCount.toLocaleString() : '—'}
                </span>
                <span className="text-xs text-slate-400 font-medium">steps</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <ProgressBar progress={stepsPct} color="#10b981" size="sm" />
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1.5">
                <span>{exerciseDuration ? `${exerciseDuration}m exercise` : 'Daily Target'}</span>
                <span>8,000 goal</span>
              </div>
            </div>
          </div>
        </div>

        {/* SUB-SCORE COLLAPSIBLE BREAKDOWN */}
        <AnimatePresence>
          {showSubScores && dynamicScore?.subScores && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-500" />
                Dynamic Sub-Score Breakdown (0 - 100 pts)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1">Sleep</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{dynamicScore.subScores.sleepScore}</span>
                  <ProgressBar progress={dynamicScore.subScores.sleepScore} color="#6366f1" size="sm" className="mt-2" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1">Hydration</span>
                  <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">{dynamicScore.subScores.hydrationScore}</span>
                  <ProgressBar progress={dynamicScore.subScores.hydrationScore} color="#06b6d4" size="sm" className="mt-2" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1">Activity</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{dynamicScore.subScores.activityScore}</span>
                  <ProgressBar progress={dynamicScore.subScores.activityScore} color="#10b981" size="sm" className="mt-2" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1">Nutrition</span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400">{dynamicScore.subScores.nutritionScore}</span>
                  <ProgressBar progress={dynamicScore.subScores.nutritionScore} color="#f59e0b" size="sm" className="mt-2" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1">Lifestyle</span>
                  <span className="text-lg font-black text-rose-600 dark:text-rose-400">{dynamicScore.subScores.lifestyleScore}</span>
                  <ProgressBar progress={dynamicScore.subScores.lifestyleScore} color="#f43f5e" size="sm" className="mt-2" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. MAIN DASHBOARD CONTENT GRID (LEFT 2/3 & RIGHT 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT 2 COLUMNS: HEALTH SCORE TREND CHART & DETAILED METRICS */}
          <div className="lg:col-span-2 space-y-6">

            {/* A. CENTRAL HEALTH SCORE TREND CHART (INSPIRED BY REFERENCE CURVED AREA CHART) */}
            <div className="bg-white dark:bg-slate-900/80 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Health Score Trend
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clinical score trajectory across your health assessments
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setChartTimeframe('7d')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        chartTimeframe === '7d'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartTimeframe('30d')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        chartTimeframe === '30d'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      30 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartTimeframe('3m')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        chartTimeframe === '3m'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      3 Months
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Render or Empty State (Real Data Only) */}
              {filteredChartData.length >= 2 ? (
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                        ticks={[0, 25, 50, 75, 100]}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#scoreAreaGradient)" 
                        dot={{ fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-12 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                  <Activity size={32} className="text-slate-400 mb-2" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Not enough data to display health score trend
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Complete at least 2 health assessments to generate your longitudinal trajectory chart.
                  </p>
                  <Link to="/assessment" className="mt-4">
                    <Button size="sm" icon={<Plus size={14} />}>
                      Take Assessment
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* B. TODAY'S HEALTH TRACKING BIOMETRICS */}
            <div className="bg-white dark:bg-slate-900/80 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="text-indigo-600 dark:text-indigo-400" size={20} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Today's Recorded Biometrics
                  </h3>
                </div>
                <Link to="/tracking" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  Full Tracking Log <ArrowRight size={13} />
                </Link>
              </div>

              {todayTracking ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Steps Count</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                      {todayTracking.physicalActivity?.steps?.toLocaleString() || 0}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {todayTracking.physicalActivity?.walkingMinutes || 0}m walked
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Exercise</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                      {todayTracking.physicalActivity?.exerciseDuration || 0}m
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {todayTracking.physicalActivity?.exerciseType || 'None'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Stress Index</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
                      {todayTracking.wellness?.stressLevel || 5} / 10
                    </span>
                    <span className="text-[10px] text-rose-500 font-medium">
                      Energy: {todayTracking.wellness?.energyLevel || 7}/10
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Overall Mood</span>
                    <span className="text-lg font-black capitalize text-slate-900 dark:text-white mt-1 block">
                      {todayTracking.wellness?.mood || 'Good'}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-medium">
                      {todayTracking.nutrition?.mealsCount || 3} meals logged
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">No daily tracking entry recorded for today yet.</p>
                  <Button size="sm" onClick={() => setIsTrackingModalOpen(true)} className="mt-3" icon={<Plus size={14} />}>
                    Log Today's Health
                  </Button>
                </div>
              )}
            </div>

            {/* C. GENEGUARD AI INSIGHTS CARD */}
            {latestAssessment?.aiAnalysis && (
              <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-slate-900/80 p-6 sm:p-7 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                    <Sparkles size={18} />
                    <span>GeneGuard AI Clinical Insights</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    Gemini Intelligence
                  </span>
                </div>

                {latestAssessment.aiAnalysis.overallHealthSummary && (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white/70 dark:bg-slate-900/50 p-4 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
                    "{latestAssessment.aiAnalysis.overallHealthSummary}"
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {latestAssessment.aiAnalysis.dietPlan?.healthyFoods?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
                      <Apple size={16} className="text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">Nutrition Focus</h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Prioritize {latestAssessment.aiAnalysis.dietPlan.healthyFoods.slice(0, 3).join(', ')}.
                        </p>
                      </div>
                    </div>
                  )}

                  {latestAssessment.aiAnalysis.sleepAnalysis?.idealBedTime && (
                    <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
                      <Moon size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">Sleep Architecture</h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Ideal sleep window: {latestAssessment.aiAnalysis.sleepAnalysis.idealBedTime} to {latestAssessment.aiAnalysis.sleepAnalysis.idealWakeTime}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Link to="/copilot" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    Ask AI Copilot for Full Plan <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT 1 COLUMN: ACTIVE GOALS, MEDICAL REPORTS, & TIMELINE */}
          <div className="space-y-6">

            {/* D. ACTIVE HEALTH GOALS */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="text-amber-500" size={18} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Goals</h3>
                </div>
                <Link to="/goals" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Manage →
                </Link>
              </div>

              {activeGoals.length === 0 ? (
                <div className="py-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">No active goals in progress.</p>
                  <Link to="/goals" className="inline-block mt-2">
                    <Button size="sm" icon={<Plus size={13} />}>Set a Goal</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeGoals.map((goal) => {
                    const pct = Math.min(100, Math.round((goal.current / goal.target) * 100)) || 0;
                    return (
                      <div key={goal._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                          <span className="text-slate-900 dark:text-white truncate max-w-[140px]">{goal.title}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 text-[11px]">{goal.current}/{goal.target} {goal.unit} ({pct}%)</span>
                        </div>
                        <ProgressBar progress={pct} color="#6366f1" size="sm" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* E. RECENT MEDICAL REPORTS */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-purple-500" size={18} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Reports</h3>
                </div>
                <Link to="/reports" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  All →
                </Link>
              </div>

              {recentReports.length === 0 ? (
                <div className="py-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">No medical reports uploaded yet.</p>
                  <Link to="/reports" className="inline-block mt-2">
                    <Button size="sm" icon={<Plus size={13} />}>Upload Report</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentReports.map((report) => (
                    <div key={report._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="truncate max-w-[170px]">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{report.fileName}</h4>
                        <span className="text-[10px] text-slate-400 block">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Link to="/reports">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* F. RECENT TIMELINE EVENTS */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="text-indigo-500" size={18} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Health Timeline</h3>
                </div>
                <Link to="/timeline" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Full →
                </Link>
              </div>

              {recentTimeline.length === 0 ? (
                <div className="py-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">No health timeline events yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentTimeline.slice(0, 4).map((ev) => (
                    <div key={ev._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
                      <div className="truncate flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{ev.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{ev.description}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                        {new Date(ev.eventDate || ev.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* DAILY TRACKING MODAL */}
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

