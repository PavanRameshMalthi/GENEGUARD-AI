import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import DailyTrackingModal from '@/components/features/DailyTrackingModal';
import { DailyTracking } from '@/types';
import { trackingService } from '@/services/tracking.service';
import { useToast } from '@/hooks/useToast';
import { 
  Activity, 
  Droplet, 
  Moon, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Smile, 
  Zap, 
  Apple, 
  Flame 
} from 'lucide-react';

export default function DailyTrackingPage() {
  const [loading, setLoading] = useState(true);
  const [trackingList, setTrackingList] = useState<DailyTracking[]>([]);
  const [todayTracking, setTodayTracking] = useState<DailyTracking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<DailyTracking | null>(null);
  const { success, error } = useToast();

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const [historyRes, todayRes] = await Promise.allSettled([
        trackingService.getTrackingHistory({ limit: 30 }),
        trackingService.getTodayTracking()
      ]);

      if (historyRes.status === 'fulfilled' && historyRes.value.data) {
        setTrackingList(historyRes.value.data);
      }
      if (todayRes.status === 'fulfilled') {
        setTodayTracking(todayRes.value.data || null);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this daily tracking record?')) return;
    try {
      await trackingService.deleteTracking(id);
      success('Daily record deleted successfully');
      fetchTrackingData();
    } catch {
      error('Failed to delete tracking record');
    }
  };

  const handleEdit = (track: DailyTracking) => {
    setSelectedTracking(track);
    setIsModalOpen(true);
  };

  const handleNewLog = () => {
    setSelectedTracking(null);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout title="Daily Health Tracking">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header with Title and Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Activity size={14} /> Real-Time Biometrics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Daily Health Tracking
            </h1>
          </div>
          <Button onClick={handleNewLog} icon={<Plus size={16} />}>
            {todayTracking ? 'Update Today’s Log' : 'Log Today’s Metrics'}
          </Button>
        </div>

        {/* Today's Summary Card */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        ) : todayTracking ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-primary-500" /> Today's Overview ({todayTracking.date})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Hydration */}
              <Card glass className="p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
                  <span className="flex items-center gap-1.5"><Droplet size={16} /> Hydration</span>
                  <span>{todayTracking.hydration?.waterConsumed} / {todayTracking.hydration?.waterGoal} L</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  {todayTracking.hydration?.waterConsumed} <span className="text-sm font-normal text-gray-400">L</span>
                </div>
                <ProgressBar 
                  progress={Math.min(100, Math.round(((todayTracking.hydration?.waterConsumed || 0) / (todayTracking.hydration?.waterGoal || 2.5)) * 100))} 
                  color="#06b6d4" 
                  size="sm" 
                />
                <div className="text-[11px] text-gray-400 mt-1.5 flex justify-between">
                  <span>Remaining: {todayTracking.hydration?.remainingWater || 0} L</span>
                  <span>{Math.round(((todayTracking.hydration?.waterConsumed || 0) / (todayTracking.hydration?.waterGoal || 2.5)) * 100)}%</span>
                </div>
              </Card>

              {/* Sleep */}
              <Card glass className="p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  <span className="flex items-center gap-1.5"><Moon size={16} /> Restorative Sleep</span>
                  <span>Goal: {todayTracking.sleep?.sleepGoal} hrs</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  {todayTracking.sleep?.totalSleep} <span className="text-sm font-normal text-gray-400">hrs</span>
                </div>
                <ProgressBar 
                  progress={Math.min(100, Math.round(((todayTracking.sleep?.totalSleep || 0) / (todayTracking.sleep?.sleepGoal || 8)) * 100))} 
                  color="#6366f1" 
                  size="sm" 
                />
                <div className="text-[11px] text-gray-400 mt-1.5">
                  Schedule: {todayTracking.sleep?.bedtime} – {todayTracking.sleep?.wakeUpTime}
                </div>
              </Card>

              {/* Steps & Activity */}
              <Card glass className="p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                  <span className="flex items-center gap-1.5"><Activity size={16} /> Movement</span>
                  <span>{todayTracking.physicalActivity?.walkingMinutes} mins walk</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  {todayTracking.physicalActivity?.steps?.toLocaleString()} <span className="text-sm font-normal text-gray-400">steps</span>
                </div>
                <ProgressBar 
                  progress={Math.min(100, Math.round(((todayTracking.physicalActivity?.steps || 0) / 10000) * 100))} 
                  color="#10b981" 
                  size="sm" 
                />
                <div className="text-[11px] text-gray-400 mt-1.5 truncate">
                  Workout: {todayTracking.physicalActivity?.exerciseType || 'None'} ({todayTracking.physicalActivity?.exerciseDuration} mins)
                </div>
              </Card>

              {/* Wellness & Mood */}
              <Card glass className="p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">
                  <span className="flex items-center gap-1.5"><Smile size={16} /> Wellness</span>
                  <span className="capitalize">{todayTracking.wellness?.mood}</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  {todayTracking.wellness?.energyLevel} <span className="text-sm font-normal text-gray-400">/ 10 Energy</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>Stress Level:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{todayTracking.wellness?.stressLevel}/10</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1 truncate">
                  Sugar: <span className="capitalize font-medium">{todayTracking.nutrition?.sugarIntake}</span> • Fast Food: {todayTracking.nutrition?.fastFood ? 'Yes' : 'No'}
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <Card glass className="p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 flex items-center justify-center mx-auto mb-3">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">No Tracking Logged Today</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
              Record your water intake, sleep, steps, and wellness today to maintain an accurate dynamic health score.
            </p>
            <Button onClick={handleNewLog} size="sm" className="mt-4" icon={<Plus size={14} />}>
              Log Today's Data
            </Button>
          </Card>
        )}

        {/* History Table */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Daily Logs</h2>
            <span className="text-xs text-gray-400">{trackingList.length} logs recorded</span>
          </div>

          {loading ? (
            <LoadingSkeleton variant="card" />
          ) : trackingList.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No Daily Tracking Records"
              description="You have not logged any daily health tracking data yet. Start logging your hydration, sleep, and physical activity."
              action={{ label: 'Log First Daily Entry', onClick: handleNewLog }}
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200/60 dark:border-gray-800">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold">Date</th>
                      <th className="px-5 py-3.5 font-semibold">Hydration</th>
                      <th className="px-5 py-3.5 font-semibold">Sleep</th>
                      <th className="px-5 py-3.5 font-semibold">Steps</th>
                      <th className="px-5 py-3.5 font-semibold">Workout</th>
                      <th className="px-5 py-3.5 font-semibold">Mood & Stress</th>
                      <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {trackingList.map((track) => (
                      <tr key={track._id || track.date} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          {track.date}
                        </td>
                        <td className="px-5 py-4 text-cyan-600 dark:text-cyan-400 font-medium">
                          {track.hydration?.waterConsumed || 0} / {track.hydration?.waterGoal || 2.5} L
                        </td>
                        <td className="px-5 py-4 text-indigo-600 dark:text-indigo-400 font-medium">
                          {track.sleep?.totalSleep || 0} hrs
                        </td>
                        <td className="px-5 py-4 text-emerald-600 dark:text-emerald-400 font-medium">
                          {track.physicalActivity?.steps?.toLocaleString() || 0}
                        </td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                          {track.physicalActivity?.exerciseDuration ? `${track.physicalActivity.exerciseDuration}m (${track.physicalActivity.exerciseType || 'Exercise'})` : '—'}
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <span className="capitalize font-medium text-gray-800 dark:text-gray-200">{track.wellness?.mood || 'good'}</span>
                          <span className="text-gray-400 ml-1.5">(Stress: {track.wellness?.stressLevel || 5}/10)</span>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(track)}
                              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              title="Edit Log"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => track._id && handleDelete(track._id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              title="Delete Log"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Logging / Editing */}
        <DailyTrackingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTracking(null);
          }}
          onSuccess={fetchTrackingData}
          initialData={selectedTracking}
        />
      </div>
    </DashboardLayout>
  );
}
