import React from 'react';
import { FileText, FileImage, Calendar, Sparkles } from 'lucide-react';
import { Report } from '@/types';

interface ReportPreviewProps {
  report: Report;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report }) => {
  const isImage = report.fileType?.includes('image') || false;

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/20 transition-all duration-300">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg">
            {isImage ? <FileImage size={20} /> : <FileText size={20} />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-xs">
              {report.fileName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="uppercase">{report.fileType?.split('/')[1] || 'PDF'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(report.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {isImage && report.filePath && (
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
          <img src={report.filePath} alt={report.fileName} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
        </div>
      )}

      {report.aiSummary && (
        <div className="p-5 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/10 dark:to-transparent">
          <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">AI Insights</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {report.aiSummary}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;
