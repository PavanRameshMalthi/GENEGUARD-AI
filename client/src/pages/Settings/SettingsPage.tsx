import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  FileSpreadsheet, 
  FileJson, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  User,
  ChevronRight,
  Shield,
  Bell,
  Lock,
  ExternalLink
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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        
        {/* Header (Reference Design 9) */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your account, preferences, and security settings.
          </p>
        </div>

        {/* 1. ACCOUNT SECTION (Reference Design 9) */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Account</h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</h3>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                  {user?.role || 'Member'}
                </span>
              </div>
            </div>

            <Link to="/profile">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. APPEARANCE / PREFERENCES SECTION (Reference Design 9 & 10) */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Appearance</h2>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 border rounded-2xl flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Sun size={22} className={theme === 'light' ? 'text-amber-500' : 'text-slate-400'} />
              <span className="text-xs">Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 border rounded-2xl flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Moon size={22} className={theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'} />
              <span className="text-xs">Dark Mode</span>
            </button>
          </div>
        </div>

        {/* 3. GDPR & HIPAA DATA PORTABILITY SECTION */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Data & Privacy (GDPR / HIPAA)</h2>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export your entire biometric history and clinical records at any time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              loading={exportingJSON}
              onClick={handleExportJSON}
              icon={<FileJson size={15} />}
              className="w-full justify-center text-xs py-2.5"
            >
              All Records (JSON)
            </Button>

            <Button
              variant="outline"
              size="sm"
              loading={exportingTrackingCSV}
              onClick={() => handleExportCSV('tracking')}
              icon={<FileSpreadsheet size={15} />}
              className="w-full justify-center text-xs py-2.5"
            >
              Daily Logs (CSV)
            </Button>

            <Button
              variant="outline"
              size="sm"
              loading={exportingGoalsCSV}
              onClick={() => handleExportCSV('goals')}
              icon={<FileSpreadsheet size={15} />}
              className="w-full justify-center text-xs py-2.5"
            >
              Goals (CSV)
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Selective Module Reset</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">AI Chat History</span>
                <Button
                  size="sm"
                  variant="outline"
                  loading={purging === 'chat'}
                  onClick={() => handlePurge('chat', 'Chat History')}
                  className="text-xs text-rose-600 hover:text-rose-700 h-8"
                >
                  Clear
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Daily Tracking Logs</span>
                <Button
                  size="sm"
                  variant="outline"
                  loading={purging === 'tracking'}
                  onClick={() => handlePurge('tracking', 'Daily Tracking Logs')}
                  className="text-xs text-rose-600 hover:text-rose-700 h-8"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. DANGER ZONE: ACCOUNT DELETION */}
        <div className="bg-white dark:bg-slate-900/90 border border-rose-200 dark:border-rose-950/60 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Danger Zone</h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
              Permanently delete your account and all associated health, genetic, and diagnostic records.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-rose-600 border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0 text-xs font-bold"
              icon={<Trash2 size={14} />}
            >
              Delete Account
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 dark:border-rose-900 z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Account Deletion
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Please enter your password to permanently delete your account and all health data.
                </p>
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-3.5 pt-2">
                <div>
                  <input
                    type="password"
                    required
                    placeholder="Enter account password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="flex-1 text-xs"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={deletingAccount}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Delete Forever
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
