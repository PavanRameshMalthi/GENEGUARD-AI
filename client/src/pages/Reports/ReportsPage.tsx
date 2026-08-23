import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportUpload from '@/components/features/ReportUpload';
import StructuredReportModal from '@/components/features/StructuredReportModal';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { reportService } from '@/services/report.service';
import { Report } from '@/types';
import { 
  FileText, 
  FileImage, 
  Search, 
  ArrowUpDown, 
  Eye, 
  Download, 
  Trash2, 
  Sparkles, 
  RotateCw,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
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

  const handleUpload = async (file: File) => {
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

  return (
    <DashboardLayout title="Medical Reports">
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <FileText size={14} /> Diagnostic Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Medical Reports & Lab History
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Upload and securely store clinical documents (PDF, JPG, PNG). GeneGuard AI extracts structured educational summaries and questions to ask your physician.
          </p>
        </div>

        <DisclaimerBanner />

        {/* Upload Widget */}
        <ReportUpload onUpload={handleUpload} uploading={uploading} />

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search reports or findings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary-500/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <ArrowUpDown size={13} /> Sort:
            </span>
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Uploaded Medical Reports</h2>
            <span className="text-xs text-gray-400">{reports.length} files</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          ) : reports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Medical Reports Uploaded"
              description={searchQuery ? 'No reports matched your search query.' : 'Upload your blood tests, lipid panels, or diagnostic reports to receive AI-powered educational summaries.'}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => {
                const isImage = report.fileType?.includes('image');
                const analysis = report.structuredAnalysis;

                return (
                  <Card key={report._id} glass className="p-5 transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Icon & Info */}
                      <div className="flex items-start gap-3.5">
                        <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 shrink-0">
                          {isImage ? <FileImage size={24} /> : <FileText size={24} />}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-base">
                              {report.fileName}
                            </h3>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                              {report.reportType || 'General Report'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              report.status === 'analyzed'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}>
                              {report.status || 'analyzed'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span className="uppercase">{report.fileType?.split('/')[1] || 'PDF'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                          icon={<Eye size={14} />}
                        >
                          View Analysis
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReanalyze(report._id)}
                          loading={analyzingId === report._id}
                          title="Re-analyze report"
                        >
                          <RotateCw size={14} />
                        </Button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="p-2 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Delete report"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Quick Summary Snippet */}
                    {(analysis?.summary || report.aiSummary) && (
                      <div className="mt-4 p-3.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/80 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold mb-1">
                          <Sparkles size={13} /> AI Insights Summary:
                        </div>
                        <p className="line-clamp-2">
                          {analysis?.summary || report.aiSummary}
                        </p>
                      </div>
                    )}
                  </Card>
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
