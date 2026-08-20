import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportUpload from '@/components/features/ReportUpload';
import ReportPreview from '@/components/features/ReportPreview';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/hooks/useToast';
import { reportService } from '@/services/report.service';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await reportService.getReports();
      setReports(res.data || []);
    } catch {
      // Failed to load — show empty state
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await reportService.uploadReport(formData);
      success('Report uploaded successfully');
      fetchReports();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Medical Reports</h1>
        </div>
        <DisclaimerBanner />
        <ReportUpload onUpload={handleUpload} uploading={uploading} />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Reports</h2>
          {loading ? (
            <div className="space-y-4">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              No reports uploaded yet.
            </div>
          ) : (
            reports.map(r => <ReportPreview key={r._id || r.id} report={r} />)
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
