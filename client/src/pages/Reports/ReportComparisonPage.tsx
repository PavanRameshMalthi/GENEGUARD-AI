import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import { reportService } from '@/services/report.service';
import { Report, ReportComparisonResult } from '@/types';
import { useToast } from '@/hooks/useToast';
import { 
  GitCompare, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Stethoscope, 
  HelpCircle,
  Calendar,
  RotateCw
} from 'lucide-react';

export default function ReportComparisonPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReport1, setSelectedReport1] = useState<string>('');
  const [selectedReport2, setSelectedReport2] = useState<string>('');
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ReportComparisonResult | null>(null);
  const { error: showError, success } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoadingReports(true);
        const res = await reportService.getReports({ sort: 'oldest' });
        if (res.data && res.data.length > 0) {
          setReports(res.data);
          if (res.data.length >= 2) {
            setSelectedReport1(res.data[0]._id);
            setSelectedReport2(res.data[res.data.length - 1]._id);
          } else if (res.data.length === 1) {
            setSelectedReport1(res.data[0]._id);
          }
        }
      } catch {
        // Failed
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  const handleRunComparison = async () => {
    if (!selectedReport1 || !selectedReport2) {
      showError('Please select two reports to compare');
      return;
    }
    if (selectedReport1 === selectedReport2) {
      showError('Please choose two distinct reports from different dates');
      return;
    }

    setComparing(true);
    try {
      const res = await reportService.compareReports(selectedReport1, selectedReport2);
      if (res.data) {
        setComparisonResult(res.data);
        success('Longitudinal report comparison generated!');
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to compare reports');
    } finally {
      setComparing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'improved':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60';
      case 'deteriorated':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60';
      case 'stable':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/60';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200/60';
    }
  };

  return (
    <DashboardLayout title="Report Comparison">
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <GitCompare size={14} /> Diagnostic Evolution
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Medical Report Comparison
            </h1>
          </div>
          <Link to="/reports">
            <Button variant="outline" size="sm">
              Back to Reports
            </Button>
          </Link>
        </div>

        <DisclaimerBanner />

        {/* Report Selector Controls */}
        {loadingReports ? (
          <LoadingSkeleton variant="card" />
        ) : reports.length < 2 ? (
          <EmptyState
            icon={FileText}
            title="At Least 2 Reports Needed"
            description="You have uploaded 1 or fewer medical reports. Please upload a second lab test or diagnostic report to perform longitudinal comparison."
            action={{ label: 'Upload Medical Report', onClick: () => window.location.href = '/reports' }}
          />
        ) : (
          <Card glass className="p-6">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GitCompare size={18} className="text-primary-500" /> Select Reports to Compare Chronologically
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Report 1 (Baseline) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Baseline / Earlier Diagnostic Report
                </label>
                <select
                  value={selectedReport1}
                  onChange={(e) => setSelectedReport1(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white"
                >
                  {reports.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.fileName} ({new Date(r.createdAt).toLocaleDateString()}) - {r.reportType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Report 2 (Follow-up) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Follow-up / Recent Diagnostic Report
                </label>
                <select
                  value={selectedReport2}
                  onChange={(e) => setSelectedReport2(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white"
                >
                  {reports.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.fileName} ({new Date(r.createdAt).toLocaleDateString()}) - {r.reportType}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                onClick={handleRunComparison}
                loading={comparing}
                icon={<Sparkles size={16} />}
                className="px-6"
              >
                Run AI Comparison Analysis
              </Button>
            </div>
          </Card>
        )}

        {/* Comparison Results Section */}
        {comparisonResult && (
          <div className="space-y-6">
            {/* Overview Banner */}
            <Card glass className="p-6 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/20 border-primary-100 dark:border-primary-900/40">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm mb-2">
                <Sparkles size={18} /> Executive Comparative Overview
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {comparisonResult.overallComparisonSummary}
              </p>
            </Card>

            {/* Biomarker Deltas Table */}
            <Card glass className="p-0 overflow-hidden" title="Biomarker Longitudinal Deltas">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-gray-800/80 uppercase text-[11px] font-bold text-gray-500 dark:text-gray-400 border-b border-gray-200/60 dark:border-gray-800">
                      <th className="p-4">Biomarker / Finding</th>
                      <th className="p-4">Baseline ({new Date(comparisonResult.report1.date).toLocaleDateString()})</th>
                      <th className="p-4">Follow-up ({new Date(comparisonResult.report2.date).toLocaleDateString()})</th>
                      <th className="p-4">Delta / Change</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {comparisonResult.deltas.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="p-4 font-bold text-gray-900 dark:text-white">
                          {d.metric}
                          {d.clinicalContext && (
                            <span className="block text-[11px] font-normal text-gray-400 mt-0.5">
                              {d.clinicalContext}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">
                          {d.previousValue}
                        </td>
                        <td className="p-4 text-gray-900 dark:text-white font-bold">
                          {d.currentValue}
                        </td>
                        <td className="p-4 font-mono font-bold text-xs text-primary-600 dark:text-primary-400">
                          {d.changeValue}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getStatusBadge(d.status)}`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Improvements & Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card glass title="Positive Health Improvements" icon={<CheckCircle2 className="text-emerald-500" />}>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {comparisonResult.improvements?.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card glass title="Areas Requiring Monitoring" icon={<AlertTriangle className="text-amber-500" />}>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {comparisonResult.concerns?.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Questions for Doctor */}
            <Card glass title="Recommended Questions for Your Next Physician Consultation" icon={<HelpCircle className="text-indigo-500" />}>
              <div className="space-y-2.5 text-xs sm:text-sm">
                {comparisonResult.questionsForDoctor?.map((q, i) => (
                  <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 flex items-start gap-2.5">
                    <span className="font-bold text-primary-500">{i + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
