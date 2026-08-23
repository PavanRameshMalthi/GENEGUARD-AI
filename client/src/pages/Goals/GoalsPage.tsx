import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import GoalModal from '@/components/features/GoalModal';
import { HealthGoal } from '@/types';
import { goalService } from '@/services/goal.service';
import { useToast } from '@/hooks/useToast';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function GoalsPage() {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal | null>(null);
  const { success, error } = useToast();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalService.getGoals();
      if (res.data) {
        setGoals(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this health goal?')) return;
    try {
      await goalService.deleteGoal(id);
      success('Goal deleted successfully');
      fetchGoals();
    } catch {
      error('Failed to delete goal');
    }
  };

  const handleToggleComplete = async (goal: HealthGoal) => {
    const nextStatus = goal.status === 'Completed' ? 'In Progress' : 'Completed';
    const nextProgress = nextStatus === 'Completed' ? goal.target : goal.current;
    try {
      await goalService.updateGoal(goal._id, { status: nextStatus, current: nextProgress });
      success(nextStatus === 'Completed' ? 'Goal marked as completed! 🎉' : 'Goal status updated');
      fetchGoals();
    } catch {
      error('Failed to update goal');
    }
  };

  const handleQuickProgress = async (goal: HealthGoal, increment: number) => {
    const nextVal = Math.max(0, Number((goal.current + increment).toFixed(1)));
    try {
      await goalService.updateGoal(goal._id, { current: nextVal });
      fetchGoals();
    } catch {
      error('Failed to update progress');
    }
  };

  const filteredGoals = goals.filter(g => {
    if (filterStatus === 'all') return true;
    return g.status.toLowerCase().replace(' ', '-') === filterStatus;
  });

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'In Progress').length;
  const overdueGoals = goals.filter(g => g.status === 'Overdue').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/50';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/50';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/50';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200/50';
    }
  };

  return (
    <DashboardLayout title="Health Goals">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Target size={14} /> Preventive Action Goals
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Health & Wellness Goals
            </h1>
          </div>
          <Button onClick={() => { setSelectedGoal(null); setIsModalOpen(true); }} icon={<Plus size={16} />}>
            Create Goal
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card glass className="p-4 text-center">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Goals</div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{totalGoals}</div>
          </Card>
          <Card glass className="p-4 text-center">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">In Progress</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{inProgressGoals}</div>
          </Card>
          <Card glass className="p-4 text-center">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Completed</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{completedGoals}</div>
          </Card>
          <Card glass className="p-4 text-center">
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Overdue</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">{overdueGoals}</div>
          </Card>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { id: 'all', label: 'All Goals' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'overdue', label: 'Overdue' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                filterStatus === tab.id
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white/70 dark:bg-gray-900/70 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/60 dark:border-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        ) : filteredGoals.length === 0 ? (
          <EmptyState
            icon={Target}
            title={goals.length === 0 ? 'No Health Goals Yet' : 'No Goals in This Category'}
            description={
              goals.length === 0
                ? 'Create achievable health goals such as daily hydration targets, step counts, or sleep regularity to maintain positive habits.'
                : 'No health goals match the selected filter.'
            }
            action={goals.length === 0 ? { label: 'Create First Goal', onClick: () => { setSelectedGoal(null); setIsModalOpen(true); } } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGoals.map((goal) => {
              const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100)) || 0;
              const isDone = goal.status === 'Completed';

              return (
                <Card key={goal._id} glass className="p-5 flex flex-col justify-between transition-all hover:shadow-md">
                  <div>
                    {/* Top Row: Title & Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-0.5 capitalize">
                          {goal.category}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">
                          {goal.title}
                        </h3>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(goal.status)} shrink-0`}>
                        {goal.status}
                      </span>
                    </div>

                    {/* Progress Stats */}
                    <div className="my-4">
                      <div className="flex items-baseline justify-between text-xs font-semibold mb-1.5">
                        <span className="text-gray-600 dark:text-gray-300">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                        <span className="font-bold text-primary-600 dark:text-primary-400">
                          {percentage}%
                        </span>
                      </div>
                      <ProgressBar 
                        progress={percentage} 
                        color={isDone ? '#10b981' : percentage >= 75 ? '#06b6d4' : '#6366f1'} 
                        size="md" 
                      />
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                      <Calendar size={13} />
                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickProgress(goal, goal.unit === 'L' ? 0.25 : goal.unit === 'steps' ? 1000 : 1)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 transition-colors"
                        title="Add progress"
                      >
                        +{goal.unit === 'L' ? '0.25L' : goal.unit === 'steps' ? '1k steps' : `1 ${goal.unit}`}
                      </button>
                      <button
                        onClick={() => handleToggleComplete(goal)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                          isDone
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <CheckCircle2 size={13} />
                        {isDone ? 'Undo' : 'Complete'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelectedGoal(goal); setIsModalOpen(true); }}
                        className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Edit Goal"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal */}
        <GoalModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedGoal(null); }}
          onSuccess={fetchGoals}
          goalToEdit={selectedGoal}
        />
      </div>
    </DashboardLayout>
  );
}
