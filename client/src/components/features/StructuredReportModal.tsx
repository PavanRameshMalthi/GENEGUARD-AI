import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Report } from '@/types';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  Download, 
  Stethoscope, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StructuredReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

const StructuredReportModal: React.FC<StructuredReportModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  if (!report) return null;

  const analysis = report.structuredAnalysis;

  const handleDownload = () => {
    if (report._id) {
      window.open(`/api/reports/${report._id}/download`, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Report Analysis: ${report.fileName}`} size="lg">
      <div className="space-y-6">
        {/* Report Overview Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-xs">{report.fileName}</h4>
              <p className="text-xs text-gray-500">
                Category: <span className="font-medium text-gray-700 dark:text-gray-300">{report.reportType || 'General Report'}</span> • {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} icon={<Download size={14} />}>
            Download File
          </Button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <p className="leading-relaxed">
            <strong>Medical Disclaimer:</strong> This AI-generated summary is for educational and preventive wellness purposes only and is not a medical diagnosis. Always discuss clinical findings with a qualified healthcare professional.
          </p>
        </div>

        {/* AI Summary */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-50/60 to-transparent dark:from-primary-950/20 border border-primary-100/60 dark:border-primary-900/30">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm mb-2">
            <Sparkles size={16} /> Report Summary
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {analysis?.summary || report.aiSummary || 'Summary is being processed.'}
          </p>
        </div>

        {/* Findings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Important Findings */}
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
            <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-primary-500" /> Key Findings
            </h5>
            {analysis?.importantFindings && analysis.importantFindings.length > 0 ? (
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                {analysis.importantFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No specific findings listed.</p>
            )}
          </div>

          {/* Possible Areas of Concern */}
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
            <h5 className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Potential Areas to Review
            </h5>
            {analysis?.possibleConcerns && analysis.possibleConcerns.length > 0 ? (
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                {analysis.possibleConcerns.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No acute concerns highlighted.</p>
            )}
          </div>
        </div>

        {/* Abnormal vs Normal Values (if detected) */}
        {((analysis?.abnormalValues && analysis.abnormalValues.length > 0) ||
          (analysis?.normalValues && analysis.normalValues.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.abnormalValues && analysis.abnormalValues.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <h5 className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                  Potential Elevated / Out-of-Range Markers
                </h5>
                <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-200">
                  {analysis.abnormalValues.map((v, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.normalValues && analysis.normalValues.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                  Markers in Standard Reference Range
                </h5>
                <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
                  {analysis.normalValues.map((v, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Questions to Ask Doctor */}
        {analysis?.questionsForDoctor && analysis.questionsForDoctor.length > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
            <h5 className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-1.5">
              <HelpCircle size={15} /> Questions to Ask Your Doctor
            </h5>
            <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
              {analysis.questionsForDoctor.map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight size={13} className="text-indigo-500 mt-0.5 shrink-0" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Follow-up */}
        {analysis?.recommendedFollowUp && analysis.recommendedFollowUp.length > 0 && (
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <Stethoscope size={14} className="text-primary-500" /> Recommended Follow-up
            </h5>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              {analysis.recommendedFollowUp.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default StructuredReportModal;
