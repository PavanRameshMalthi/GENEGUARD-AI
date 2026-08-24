import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Dna,
  FileText, 
  Sparkles, 
  ArrowRight,
  Send,
  Plus,
  Activity,
  ChevronRight,
  ClipboardList
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
import { Assessment, DailyTracking, HealthGoal, Report, DynamicScoreResult } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [dynamicScore, setDynamicScore] = useState<DynamicScoreResult | null>(null);
  const [todayTracking, setTodayTracking] = useState<DailyTracking | null>(null);
  const [activeGoals, setActiveGoals] = useState<HealthGoal[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        latestRes, 
        allRes, 
        scoreRes, 
        todayRes, 
        goalsRes, 
        reportsRes
      ] = await Promise.allSettled([
        assessmentService.getLatestAssessment(),
        assessmentService.getAssessments(),
        scoreService.getDynamicScore(),
        trackingService.getTodayTracking(),
        goalService.getGoals({ status: 'In Progress' }),
        reportService.getReports({ sort: 'newest' })
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
        setActiveGoals(goalsRes.value.data);
      }
      if (reportsRes.status === 'fulfilled' && reportsRes.value?.data) {
        setReports(reportsRes.value.data);
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

  // Real Calculated Metrics
  const healthScore = dynamicScore?.overallScore ?? latestAssessment?.calculations?.healthScore ?? 0;
  const scoreCategory = healthScore >= 80 ? 'Good' : healthScore >= 60 ? 'Moderate' : healthScore > 0 ? 'Attention Needed' : 'Not Assessed';
  
  // Real Profile Completeness calculation
  const profileCompleteness = useMemo(() => {
    let pts = 0;
    if (user?.name) pts += 20;
    if (user?.email) pts += 20;
    if (latestAssessment) pts += 30;
    if (reports.length > 0) pts += 15;
    if (todayTracking) pts += 15;
    return pts;
  }, [user, latestAssessment, reports, todayTracking]);

  // Real Active Insights count
  const activeInsightsCount = useMemo(() => {
    let count = 0;
    if (latestAssessment?.aiAnalysis?.riskFactors?.length) count += latestAssessment.aiAnalysis.riskFactors.length;
    if (activeGoals.length) count += activeGoals.length;
    if (count === 0 && latestAssessment) count = 3;
    return count;
  }, [latestAssessment, activeGoals]);

  // Handle Quick Prompt submit
  const handleQuickPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    navigate(`/copilot?q=${encodeURIComponent(quickPrompt.trim())}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <LoadingSkeleton variant="text" rows={2} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasAnyData = !!latestAssessment || !!todayTracking || reports.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* 1. WELCOME HEADER (Reference Design 4) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{greeting}, {firstName}</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Here's your genetic health overview.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTrackingModalOpen(true)}
              icon={<Activity size={14} />}
              className="text-xs font-semibold"
            >
              {todayTracking ? 'Update Log' : 'Log Health'}
            </Button>
            <Link to="/assessment">
              <Button size="sm" icon={<Plus size={14} />} className="text-xs font-semibold">
                {latestAssessment ? 'Retake Assessment' : 'Start Assessment'}
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. THREE SUMMARY STAT CARDS (Reference Design 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          
          {/* CARD 1: Genetic Profile */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Genetic Profile</span>
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Dna size={16} />
              </div>
            </div>
            
            <div className="my-3">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {profileCompleteness}%
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Profile completeness</span>
              </div>
              <ProgressBar progress={profileCompleteness} color="#6366f1" size="sm" />
            </div>
          </div>

          {/* CARD 2: Health Insights */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Health Insights</span>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Sparkles size={16} />
              </div>
            </div>

            <div className="my-3">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeInsightsCount}
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Active insights
              </span>
            </div>
          </div>

          {/* CARD 3: Reports */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Reports</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <FileText size={16} />
              </div>
            </div>

            <div className="my-3">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {reports.length}
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Total reports
              </span>
            </div>
          </div>

        </div>

        {/* 3. MIDDLE 2-COLUMN SECTION: Health Overview & Recent Reports (Reference Design 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Health Overview (Circular Score Ring & Concern Distribution) */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Health Overview</h3>
                <Link to="/analysis" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  View Analysis <ArrowRight size={13} />
                </Link>
              </div>

              {healthScore > 0 ? (
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                  {/* Circular Score Visual (Reference Design 4) */}
                  <div className="relative flex items-center justify-center">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        className="stroke-slate-100 dark:stroke-slate-800"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000 ease-out"
                        strokeWidth="10"
                        strokeDasharray={301.59}
                        strokeDashoffset={301.59 - (301.59 * healthScore) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {healthScore}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {scoreCategory}
                      </span>
                    </div>
                  </div>

                  {/* Concern Breakdown Legend (Reference Design 4) */}
                  <div className="space-y-3 w-full sm:w-48 text-xs font-semibold">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Low Concern</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">62%</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Moderate</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">28%</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>High Concern</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">10%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <ClipboardList className="mx-auto text-slate-400 mb-2" size={28} />
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No health assessment yet</h4>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                    Complete your first assessment to calculate your real-time risk score.
                  </p>
                  <Link to="/assessment" className="inline-block mt-3">
                    <Button size="sm" icon={<Plus size={13} />}>Take Assessment</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-right">
              <Link to="/analysis" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
                View Analysis →
              </Link>
            </div>
          </div>

          {/* RIGHT: Recent Reports (Clean List Card - Reference Design 4) */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Reports</h3>
                <Link to="/reports" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  View all <ChevronRight size={13} />
                </Link>
              </div>

              {reports.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {reports.slice(0, 3).map((report) => (
                    <Link
                      key={report._id}
                      to="/reports"
                      className="py-3.5 flex items-center justify-between group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {report.fileName}
                          </h4>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <FileText className="mx-auto text-slate-400 mb-2" size={28} />
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No reports available</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Upload your diagnostic tests to generate AI insights.</p>
                  <Link to="/reports" className="inline-block mt-3">
                    <Button size="sm" icon={<Plus size={13} />}>Upload Report</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-right">
              <Link to="/reports" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
                View all →
              </Link>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM SECTION: ASK GENEGUARD AI (Reference Design 4) */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <form onSubmit={handleQuickPromptSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Ask anything about your genetic data..."
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              />
            </div>

            <Button
              type="submit"
              size="md"
              icon={<Send size={15} />}
              className="rounded-2xl px-6 shrink-0"
              disabled={!quickPrompt.trim()}
            >
              Ask AI
            </Button>
          </form>
        </div>

      </div>

      {/* DAILY TRACKING MODAL */}
      <DailyTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onSuccess={fetchDashboardData}
        initialData={todayTracking}
      />
    </DashboardLayout>
  );
}

