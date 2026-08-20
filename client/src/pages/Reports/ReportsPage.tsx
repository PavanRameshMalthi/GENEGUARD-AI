import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportUpload from '@/components/features/ReportUpload';
import ReportPreview from '@/components/features/ReportPreview';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import { useToast } from '@/hooks/useToast';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const { success } = useToast();
  
  const handleUpload = (file: File) => {
    // Mock upload
    setReports(prev => [{ id: Date.now(), name: file.name, date: new Date().toISOString() }, ...prev]);
    success('Report uploaded successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Medical Reports</h1>
        </div>
        <DisclaimerBanner />
        <ReportUpload onUpload={handleUpload} uploading={false} />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Reports</h2>
          {reports.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              No reports uploaded yet.
            </div>
          ) : (
            reports.map(r => <ReportPreview key={r.id} report={r} />)
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
