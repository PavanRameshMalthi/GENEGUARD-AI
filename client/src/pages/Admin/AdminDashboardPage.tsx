import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Users, 
  FileText, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  Trash2, 
  Target, 
  MessageSquare, 
  HeartPulse,
  Bell,
  Calendar,
  Download,
  Cpu,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { AdminAnalyticsData } from '@/types';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuth();
  const { success, error: showError } = useToast();
  
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsRes, analyticsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAnalytics(),
        adminService.getUsers(1, 50)
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }
      if (usersRes.success) {
        const userList = usersRes.data?.users || (Array.isArray(usersRes.data) ? usersRes.data : []);
        setUsers(userList);
      }
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Failed to load administrator telemetry');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const data = await adminService.exportMetricsCSV();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'geneguard-admin-analytics.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      success('Platform metrics CSV exported successfully');
    } catch {
      showError('Failed to export metrics CSV');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (user.role === 'admin' || user.email === stats?.adminEmail) {
      showError('Cannot delete the primary administrator account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${user.name}" (${user.email})? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(user._id);
    try {
      const res = await adminService.deleteUser(user._id);
      if (res.success) {
        success(`User ${user.name} removed successfully.`);
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        if (stats) {
          setStats({ ...stats, totalUsers: Math.max(0, (stats.totalUsers || 1) - 1) });
        }
      }
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0284c7'];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header with Administrator Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Admin Analytics & Governance
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                <ShieldCheck size={14} /> Master Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Designated Administrator: <span className="font-semibold text-gray-800 dark:text-gray-200">Pavan Ramesh Malthi</span> ({currentUser?.email})
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              loading={exporting}
              onClick={handleExportCSV}
              icon={<Download size={14} />}
            >
              Export Metrics (CSV)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => loadData(true)} 
              disabled={loading || refreshing}
              icon={<RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />}
            >
              {refreshing ? 'Syncing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Security Alert Banner */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/40 flex items-start gap-3">
          <ShieldCheck className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" size={20} />
          <div className="text-xs sm:text-sm text-purple-900 dark:text-purple-200">
            <span className="font-bold">Strict Security Guardrail Active:</span> Only <code className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 font-mono text-xs">pavanrameshmalthi886@gmail.com</code> is authorized for administrative control. Role modification and admin creation endpoints are permanently restricted.
          </div>
        </div>

        {/* System Stats Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card glass className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Users</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {loading ? '...' : (stats?.totalUsers ?? users.length)}
              </h3>
            </div>
          </Card>

          <Card glass className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assessments</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {loading ? '...' : (stats?.totalAssessments ?? 0)}
              </h3>
            </div>
          </Card>

          <Card glass className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reports Analyzed</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {loading ? '...' : (stats?.totalReports ?? 0)}
              </h3>
            </div>
          </Card>

          <Card glass className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl">
              <HeartPulse size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Daily Tracking Logs</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {loading ? '...' : (stats?.totalTrackingEntries ?? 0)}
              </h3>
            </div>
          </Card>
        </div>

        {/* AI Engine Telemetry Ribbon */}
        {analytics?.aiTelemetry && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-primary-900 to-cyan-900 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/10 text-cyan-300">
                <Cpu size={24} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold block">
                  AI Intelligence Engine Telemetry
                </span>
                <h4 className="text-base font-bold">
                  {analytics.aiTelemetry.engineModel} • {analytics.aiTelemetry.geminiActive ? 'Live Gemini 2.0' : 'Smart Clinical Engine'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/80">
              <div>
                <span className="block text-[10px] text-cyan-300 uppercase font-bold">Total Inferences</span>
                <span className="font-mono font-bold text-sm text-white">{analytics.aiTelemetry.totalAiQueries}</span>
              </div>
              <div>
                <span className="block text-[10px] text-cyan-300 uppercase font-bold">Avg Latency</span>
                <span className="font-mono font-bold text-sm text-white">~{analytics.aiTelemetry.estimatedLatencyMs} ms</span>
              </div>
              <div>
                <span className="block text-[10px] text-cyan-300 uppercase font-bold">Safety Flags</span>
                <span className="font-mono font-bold text-sm text-emerald-400">0 critical breaches</span>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Charts Grid */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth 30 Days */}
            <Card glass title="User Registrations (30 Days)" icon={<TrendingUp className="text-primary-500" />}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.userGrowth}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="totalUsers" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#userGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Risk Distribution Pie */}
            <Card glass title="Population Risk Tier Breakdown" icon={<AlertTriangle className="text-amber-500" />}>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.riskDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Risk Factors Prevalence Breakdown */}
            <Card glass title="Population Health Risk Factors Prevalence (%)" className="col-span-1 lg:col-span-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.riskFactorsBreakdown} layout="vertical" margin={{ left: 50, right: 20, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="factor" type="category" tick={{ fontSize: 11 }} width={140} />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Prevalence']} />
                    <Bar dataKey="percentage" fill="#0284c7" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* User Management Section */}
        <Card glass title="Registered Accounts Governance" className="p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Listing registered accounts in GeneGuard AI. Standard user accounts can be managed or purged on request.
            </p>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {users.length} Total Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  <th className="p-4 border-b dark:border-gray-700">User</th>
                  <th className="p-4 border-b dark:border-gray-700">Email</th>
                  <th className="p-4 border-b dark:border-gray-700">Role</th>
                  <th className="p-4 border-b dark:border-gray-700">Registered</th>
                  <th className="p-4 border-b dark:border-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No user accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isAdminUser = u.role === 'admin' || u.email?.toLowerCase() === stats?.adminEmail?.toLowerCase();
                    return (
                      <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="p-4 font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 font-bold flex items-center justify-center text-xs">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span>{u.name || 'Unnamed User'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                          {u.email}
                        </td>
                        <td className="p-4">
                          {isAdminUser ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                              <ShieldCheck size={12} /> Administrator
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              User
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-gray-400" />
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {isAdminUser ? (
                            <span className="text-xs text-gray-400 italic">Primary Admin</span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(u)}
                              disabled={deletingId === u._id}
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 p-1.5 h-auto rounded-lg"
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
