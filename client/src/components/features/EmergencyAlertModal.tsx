import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, PhoneCall, ShieldAlert, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  emergencyType?: string;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  isOpen,
  onClose,
  message,
  emergencyType
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-red-950/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-red-500/80 z-10 space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center shrink-0 animate-bounce">
              <AlertOctagon size={32} />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-red-600 uppercase">
                Immediate Clinical Emergency Alert
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Seek Emergency Care
              </h2>
            </div>
          </div>

          {/* Body Message */}
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900 text-sm text-red-900 dark:text-red-200 leading-relaxed font-medium">
            {message || 'The symptoms described may indicate an acute medical emergency. Please contact emergency services immediately or proceed to the nearest emergency department.'}
          </div>

          {/* Emergency Hotlines Grid */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Emergency Hotlines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="tel:911"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
              >
                <PhoneCall size={18} />
                Call 911 (US/Canada)
              </a>

              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
              >
                <PhoneCall size={18} />
                Call 112 (EU/Global)
              </a>

              <a
                href="tel:988"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors col-span-1 sm:col-span-2"
              >
                <ShieldAlert size={16} className="text-primary-500" />
                Call/Text 988 — Suicide & Mental Health Crisis Lifeline
              </a>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-gray-400 text-center">
            GeneGuard AI does not provide real-time dispatch services. Do not delay emergency medical care.
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              I Understand / Dismiss
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmergencyAlertModal;
