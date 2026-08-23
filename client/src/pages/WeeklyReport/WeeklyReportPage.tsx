import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import { WeeklyHealthReport } from '@/types';
import { weeklyReportService } from '@/services/weekly-report.service';
import { useToast } from '@/hooks/useToast';
import { 
  FileBarChart, 
  Calendar, 
  Download, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Moon, 
  Droplet, 
  Activity, 
  Heart, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  RotateCw 
} from 'lucide-react';

export default function WeeklyReportPage() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [latestReport, setLatestReport] = useState<WeeklyHealthReport | null>(null);
  const [reportsList, setReportsList] = useState<WeeklyHealthReport[]>([]);
  const { success, error } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [latestRes, allRes] = await Promise.allSettled([
        weeklyReportService.getLatestWeeklyReport(),
        weeklyReportService.getWeeklyReports()
      ]);

      if (latestRes.status === 'fulfilled' && latestRes.value.data) {
        setLatestReport(latestRes.value.data);
      }
      if (allRes.status === 'fulfilled' && allRes.value.data) {
        setReportsList(allRes.value.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await weeklyReportService.generateWeeklyReport();
      if (res.data) {
        setLatestReport(res.data);
        success('Weekly Health Report generated successfully!');
        fetchReports();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Not enough health data to generate your weekly report. Track your daily health metrics to generate weekly summaries.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout title="Weekly Health Report">
      <div className="space-y-6 max-w-5xl mx-auto pb-12 print:max-w-full print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm print:hidden">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <FileBarChart size={14} /> Weekly Health Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Weekly Health Summary
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={handleGenerate}
              loading={generating}
              icon={<RotateCw size={15} />}
            >
              Generate Current Week
            </Button>
            {latestReport && (
              <Button onClick={handlePrint} icon={<Download size={15} />}>
                Print / Save PDF
              </Button>
            )}
          </div>
        </div>

        <DisclaimerBanner />

        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton variant="card" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          </div>
        ) : !latestReport ? (
          <EmptyState
            icon={FileBarChart}
            title="No Weekly Health Report Available"
            description="Not enough health data to generate your weekly report. Track at least 2 days of hydration, sleep, and physical activity to generate weekly summaries."
            action={{ label: 'Generate Weekly Report', onClick: handleGenerate }}
          />
        ) : (
          <div className="space-y-6">
            {/* Top Date & Score Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white shadow-xl shadow-primary-500/15">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-primary-100 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Calendar size={14} /> 7-Day Performance Period
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {latestReport.dateRangeFormatted}
                  </h2>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                  <div>
                    <span className="text-xs text-primary-100 block">Weekly Health Score</span>
                    <span className="text-3xl font-black">{latestReport.healthScore}</span>
                    <span className="text-xs text-primary-200"> / 100</span>
                  </div>
                  {latestReport.scoreChange !== 0 && (
                    <div className="text-xs font-bold px-2 py-1 rounded-xl bg-white/20">
                      {latestReport.scoreChange > 0 ? `+${latestReport.scoreChange}` : latestReport.scoreChange} pts
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Core Averages Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <Card glass className="p-4 text-center">
                <div className="flex items-center justify-center text-indigo-500 mb-1">
                  <Moon size={20} />
                </div>
                <div className="text-xs text-gray-500 font-medium">Avg Sleep</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {latestReport.averageSleep} <span className="text-xs font-normal text-gray-400">hrs</span>
                </div>
              </Card>

              <Card glass className="p-4 text-center">
                <div className="flex items-center justify-center text-cyan-500 mb-1">
                  <Droplet size={20} />
                </div>
                <div className="text-xs text-gray-500 font-medium">Avg Hydration</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {latestReport.averageHydration} <span className="text-xs font-normal text-gray-400">L</span>
                </div>
              </Card>

              <Card glass className="p-4 text-center">
                <div className="flex items-center justify-center text-emerald-500 mb-1">
                  <Activity size={20} />
                </div>
                <div className="text-xs text-gray-500 font-medium">Avg Steps</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {latestReport.averageSteps.toLocaleString()}
                </div>
              </Card>

              <Card glass className="p-4 text-center">
                <div className="flex items-center justify-center text-primary-500 mb-1">
                  <TrendingUp size={20} />
                </div>
                <div className="text-xs text-gray-500 font-medium">Total Exercise</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {latestReport.totalExerciseMinutes} <span className="text-xs font-normal text-gray-400">mins</span>
                </div>
              </Card>

              <Card glass className="p-4 text-center">
                <div className="flex items-center justify-center text-rose-500 mb-1">
                  <Heart size={20} />
                </div>
                <div className="text-xs text-gray-500 font-medium">Avg Stress</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {latestReport.stressAverage} <span className="text-xs font-normal text-gray-400">/ 10</span>
                </div>
              </Card>

              <Card glass className="p-4 text-center">
                <div className="flex items-center justify-center text-amber-500 mb-1">
                  <Target size={20} />
                </div>
                <div className="text-xs text-gray-500 font-medium">Goals Done</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {latestReport.goalCompletion?.percentage || 0}%
                </div>
              </Card>
            </div>

            {/* Achievements vs Areas to Improve */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Achievements */}
              <Card glass title="Weekly Achievements" icon={<CheckCircle2 className="text-emerald-500" />}>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {latestReport.achievements?.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Areas to Improve */}
              <Card glass title="Opportunities to Improve" icon={<AlertTriangle className="text-amber-500" />}>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {latestReport.areasToImprove?.map((area, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* AI Recommendations */}
            <Card glass className="p-6 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/20 border-primary-100 dark:border-primary-900/40">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm mb-3">
                <Sparkles size={18} /> AI Preventive Guidance for Next Week
              </div>
              <div className="space-y-2.5">
                {latestReport.aiRecommendations?.map((rec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white dark:bg-gray-800/80 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Next Week Action Goals */}
            <Card glass title="Recommended Goals for Next Week" icon={<Target className="text-primary-500" />}>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {latestReport.nextWeekGoals?.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary-500 mt-0.5 shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Previously Generated Reports History List */}
            {reportsList.length > 1 && (
              <div className="pt-6 print:hidden">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Past Weekly Reports</h3>
                <div className="space-y-2.5">
                  {reportsList.map((rep) => (
                    <div
                      key={rep._id}
                      onClick={() => setLatestReport(rep)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        latestReport._id === rep._id
                          ? 'bg-primary-50/50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800'
                          : 'bg-white/60 dark:bg-gray-900/60 border-gray-200/60 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileBarChart size={18} className="text-primary-500" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{rep.dateRangeFormatted}</h4>
                          <span className="text-[11px] text-gray-400">Sleep: {rep.averageSleep}h • Hydration: {rep.averageHydration}L • Steps: {rep.averageSteps.toLocaleString()}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-primary-600 dark:text-primary-400">
                        {rep.healthScore}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
