import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/user.service';
import { 
  Moon, 
  Sun, 
  Download, 
  FileSpreadsheet, 
  FileJson, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock,
  RotateCcw
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { success, error: showError } = useToast();

  const [exportingJSON, setExportingJSON] = useState(false);
  const [exportingTrackingCSV, setExportingTrackingCSV] = useState(false);
  const [exportingGoalsCSV, setExportingGoalsCSV] = useState(false);

  const [purging, setPurging] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  // 1. Data Export Handlers
  const handleExportJSON = async () => {
    try {
      setExportingJSON(true);
      const data = await userService.exportDataJSON();
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `geneguard-data-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      success('Complete health records exported (JSON)');
    } catch {
      showError('Failed to export JSON records');
    } finally {
      setExportingJSON(false);
    }
  };

  const handleExportCSV = async (type: 'tracking' | 'goals') => {
    const isTracking = type === 'tracking';
    if (isTracking) setExportingTrackingCSV(true);
    else setExportingGoalsCSV(true);

    try {
      const data = await userService.exportDataCSV(type);
      const url = window.URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `geneguard-${type}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      success(`Exported ${type} records (CSV)`);
    } catch {
      showError(`Failed to export ${type} CSV`);
    } finally {
      if (isTracking) setExportingTrackingCSV(false);
      else setExportingGoalsCSV(false);
    }
  };

  // 2. Selective Data Purge
  const handlePurge = async (target: 'chat' | 'tracking' | 'reports' | 'calendar', label: string) => {
    if (!window.confirm(`Are you sure you want to permanently clear ${label}? This cannot be undone.`)) {
      return;
    }

    setPurging(target);
    try {
      await userService.purgeData(target);
      success(`${label} cleared successfully`);
    } catch (err: any) {
      showError(err.response?.data?.message || `Failed to clear ${label}`);
    } finally {
      setPurging(null);
    }
  };

  // 3. Account Deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      showError('Please enter your account password');
      return;
    }

    setDeletingAccount(true);
    try {
      await userService.deleteAccount(deletePassword);
      success('Your account and all associated health data have been permanently deleted.');
      logout();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to delete account. Please check your password.');
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <DashboardLayout title="Settings & Privacy">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Settings & Data Governance
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your interface appearance, notifications, GDPR data portability exports, and account privacy.
          </p>
        </div>

        {/* Appearance */}
        <Card glass title="Interface Appearance" className="p-6">
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 border rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Sun size={24} className={theme === 'light' ? 'text-amber-500' : 'text-slate-400'} />
              <span>Light Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 border rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Moon size={24} className={theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'} />
              <span>Dark Mode</span>
            </button>
          </div>
        </Card>

        {/* GDPR / HIPAA Data Portability */}
        <Card glass title="Data Portability & Health Exports (GDPR / HIPAA)" className="p-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Under GDPR Article 20 and HIPAA standards, you maintain complete ownership of your medical and lifestyle logs. Export your full dataset at any time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              loading={exportingJSON}
              onClick={handleExportJSON}
              icon={<FileJson size={16} />}
              className="w-full justify-center text-xs py-3"
            >
              Export All Data (JSON)
            </Button>

            <Button
              variant="outline"
              size="sm"
              loading={exportingTrackingCSV}
              onClick={() => handleExportCSV('tracking')}
              icon={<FileSpreadsheet size={16} />}
              className="w-full justify-center text-xs py-3"
            >
              Daily Logs (CSV)
            </Button>

            <Button
              variant="outline"
              size="sm"
              loading={exportingGoalsCSV}
              onClick={() => handleExportCSV('goals')}
              icon={<FileSpreadsheet size={16} />}
              className="w-full justify-center text-xs py-3"
            >
              Health Goals (CSV)
            </Button>
          </div>
        </Card>

        {/* Selective Data Purge */}
        <Card glass title="Selective Health Data Purge" className="p-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Reset specific modules without deleting your user profile or master account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">AI Consultation History</h4>
                <p className="text-[11px] text-gray-500">Wipe chat transcripts</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                loading={purging === 'chat'}
                onClick={() => handlePurge('chat', 'Chat History')}
                className="text-xs text-rose-600 hover:text-rose-700"
              >
                Clear
              </Button>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Daily Tracking Logs</h4>
                <p className="text-[11px] text-gray-500">Reset water, sleep, step logs</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                loading={purging === 'tracking'}
                onClick={() => handlePurge('tracking', 'Daily Tracking Logs')}
                className="text-xs text-rose-600 hover:text-rose-700"
              >
                Reset
              </Button>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Uploaded Medical Reports</h4>
                <p className="text-[11px] text-gray-500">Delete uploaded files & summaries</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                loading={purging === 'reports'}
                onClick={() => handlePurge('reports', 'Medical Reports')}
                className="text-xs text-rose-600 hover:text-rose-700"
              >
                Delete
              </Button>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Preventive Calendar</h4>
                <p className="text-[11px] text-gray-500">Clear scheduled checkups</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                loading={purging === 'calendar'}
                onClick={() => handlePurge('calendar', 'Preventive Calendar')}
                className="text-xs text-rose-600 hover:text-rose-700"
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* Permanent Account Deletion */}
        <Card glass title="Account Deletion & Data Erasure" className="p-6 border-red-200 dark:border-red-900/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Permanently deletes your account, personal assessments, AI summaries, tracking history, and uploaded files. This action cannot be reversed.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-rose-600 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0"
              icon={<Trash2 size={15} />}
            >
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-300 dark:border-red-900 z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={28} />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Confirm Permanent Account Deletion
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Please confirm your password to permanently erase your profile and all clinical records.
                </p>
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Your Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter account password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="flex-1"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={deletingAccount}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    Erase Account
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
