import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onRemove }: { toast: any, onRemove: () => void }) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 3000;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - (100 / (duration / 10));
      });
    }, 10);

    const removeTimer = setTimeout(() => {
      onRemove();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(removeTimer);
    };
  }, [duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 w-80"
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type as keyof typeof icons] || icons.info}
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {toast.title}
          </p>
        )}
        {toast.message && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
        <motion.div
          className={`h-full ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.01 }}
        />
      </div>
    </motion.div>
  );
};

export default Toast;
