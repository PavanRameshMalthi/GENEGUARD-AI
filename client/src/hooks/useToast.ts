import { useToastContext } from '@/context/ToastContext';
import { ToastMessage } from '@/types';

export const useToast = () => {
  const { toasts, addToast, removeToast } = useToastContext();

  const success = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  };

  const error = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  };

  const info = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  };

  const warning = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  };

  return { toasts, addToast, removeToast, success, error, info, warning };
};
