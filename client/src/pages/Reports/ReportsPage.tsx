import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StructuredReportModal from '@/components/features/StructuredReportModal';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { reportService } from '@/services/report.service';
import { Report } from '@/types';
import { 
  FileText, 
  Search, 
  Filter, 
  Upload, 
  Eye, 
  Trash2, 
  Sparkles, 
  RotateCw,
  GitCompare,
  Printer,
  ChevronRight
} from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [downloadingSummary, setDownloadingSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: showError } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getReports({ search: searchQuery, sort: sortOrder });
      if (res.data) {
        setReports(res.data);
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchQuery, sortOrder]);

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await reportService.uploadReport(formData);
      success('Medical report uploaded and analyzed successfully!');
      fetchReports();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to upload report');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await reportService.deleteReport(id);
      success('Report deleted successfully');
      fetchReports();
    } catch {
      showError('Failed to delete report');
    }
  };

  const handleReanalyze = async (id: string) => {
    try {
      setAnalyzingId(id);
      const res = await reportService.analyzeReport(id);
      if (res.data) {
        setReports(prev => prev.map(r => r._id === id ? res.data! : r));
        success('AI Report Analysis refreshed!');
      }
    } catch {
      showError('Failed to re-analyze report');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handlePrintComprehensiveReport = async () => {
    try {
      setDownloadingSummary(true);
      const html = await reportService.downloadComprehensiveHealthReport();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch {
      showError('Could not generate health portfolio summary.');
    } finally {
      setDownloadingSummary(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        
        {/* Header (Reference Design 8) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Upload and analyze your genetic reports and medical documents.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
              icon={<Upload size={14} />}
              className="text-xs font-bold"
            >
              Upload Report
            </Button>

            <Link to="/reports/compare">
              <Button variant="outline" size="sm" icon={<GitCompare size={14} />} className="text-xs font-semibold">
                Compare
              </Button>
            </Link>
          </div>
        </div>

        <DisclaimerBanner />

        {/* Search & Filter Controls (Reference Design 8) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Filter size={13} className="text-slate-400" />
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              loading={downloadingSummary}
              onClick={handlePrintComprehensiveReport}
              icon={<Printer size={13} />}
              className="text-xs"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Reports List (Reference Design 8) */}
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          ) : reports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Reports Found"
              description={searchQuery ? 'No reports matched your search query.' : 'Upload your first medical or genetic report to generate AI-powered clinical insights.'}
              action={{ label: 'Upload Report', onClick: () => fileInputRef.current?.click() }}
            />
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const analysis = report.structuredAnalysis;

                return (
                  <div
                    key={report._id}
                    className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    {/* Left: Colored Icon & Details (Reference Design 8) */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/40">
                        <FileText size={22} />
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {report.fileName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                            {report.status || 'Analyzed'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          {report.reportType ? ` • ${report.reportType}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                        icon={<Eye size={13} />}
                        className="text-xs font-semibold"
                      >
                        View Analysis
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReanalyze(report._id)}
                        loading={analyzingId === report._id}
                        title="Re-analyze"
                      >
                        <RotateCw size={13} />
                      </Button>
                      <button
                        onClick={() => handleDelete(report._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete report"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Structured Report Analysis Modal */}
        <StructuredReportModal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          report={selectedReport}
        />

      </div>
    </DashboardLayout>
  );
}
