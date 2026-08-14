import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assessments', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setAssessments(data);
        }
      } catch (err) {
        console.error('Failed to fetch assessments');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAssessments();
  }, [user]);

  const latestAssessment = assessments[0];
  
  // Format data for chart
  const chartData = [...assessments].reverse().map(a => ({
    date: new Date(a.createdAt).toLocaleDateString(),
    score: a.aiAnalysis?.healthScore || 0
  }));

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome, {user?.name}</h1>
          <p className="text-slate-600 dark:text-slate-400">Here's your health overview today.</p>
        </div>
        <Link to="/assessment">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Assessment
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading your data...</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {latestAssessment ? (
              <Card glass className="bg-gradient-to-br from-primary/5 to-secondary/5 border-none">
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Latest Health Score</h2>
                    <div className="flex items-end gap-3 mb-4">
                      <span className="text-5xl font-extrabold text-primary">{latestAssessment.aiAnalysis?.healthScore || 'N/A'}</span>
                      <span className="text-slate-500 dark:text-slate-400 mb-1">/ 100</span>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                      latestAssessment.aiAnalysis?.riskLevel === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      latestAssessment.aiAnalysis?.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                      {latestAssessment.aiAnalysis?.riskLevel || 'Unknown'} Risk
                    </div>
                  </div>
                  <div className="flex-1 flex justify-end items-center">
                    <Link to={`/analysis/${latestAssessment._id}`}>
                      <Button variant="secondary">View Full Report</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ) : (
              <Card glass className="text-center py-12">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No Assessments Yet</h3>
                <p className="text-slate-500 mb-6">Take your first health assessment to generate your personalized wellness insights.</p>
                <Link to="/assessment">
                  <Button>Start Assessment</Button>
                </Link>
              </Card>
            )}

            {/* Chart */}
            {chartData.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Health Score Trend</h3>
                  <TrendingUp className="w-5 h-5 text-slate-400" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
          </div>

          {/* Quick Actions & AI Assistant */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/assistant" className="block p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between">
                  <span className="font-medium">Ask AI Assistant</span>
                  <Activity className="w-4 h-4 text-primary" />
                </Link>
                <Link to="/recommendations" className="block p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between">
                  <span className="font-medium">Daily Recommendations</span>
                  <Activity className="w-4 h-4 text-secondary" />
                </Link>
              </div>
            </Card>

            <Card className="bg-primary text-white border-none">
              <h3 className="font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-primary-light text-sm mb-4">Get deeper genetic insights and advanced AI predictions.</p>
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">View Plans</Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
