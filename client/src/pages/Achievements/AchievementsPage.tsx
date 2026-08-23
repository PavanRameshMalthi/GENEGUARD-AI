import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ProgressBar from '@/components/ui/ProgressBar';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import { achievementService } from '@/services/achievement.service';
import { AchievementResponse, Badge } from '@/types';
import { useToast } from '@/hooks/useToast';
import { 
  Flame, 
  Award, 
  Trophy, 
  Sparkles, 
  Droplet, 
  Moon, 
  Activity, 
  ClipboardCheck, 
  Target, 
  FileText, 
  Lock, 
  CheckCircle2,
  Zap,
  Star
} from 'lucide-react';

export default function AchievementsPage() {
  const [data, setData] = useState<AchievementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const { success } = useToast();

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await achievementService.getAchievements();
      if (res.data) {
        setData(res.data);
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'from-cyan-400 to-indigo-500 text-cyan-400 border-cyan-400/40';
      case 'gold': return 'from-amber-400 to-yellow-600 text-amber-400 border-amber-400/40';
      case 'silver': return 'from-slate-300 to-slate-500 text-slate-300 border-slate-300/40';
      default: return 'from-amber-700 to-amber-900 text-amber-700 border-amber-700/40';
    }
  };

  const getBadgeIcon = (iconName: string, size = 24) => {
    switch (iconName) {
      case 'Droplet': return <Droplet size={size} />;
      case 'Moon': return <Moon size={size} />;
      case 'Activity': return <Activity size={size} />;
      case 'ClipboardCheck': return <ClipboardCheck size={size} />;
      case 'Flame': return <Flame size={size} />;
      case 'FileText': return <FileText size={size} />;
      case 'Target': return <Target size={size} />;
      default: return <Award size={size} />;
    }
  };

  const streaks = data?.achievement?.streaks;
  const level = data?.achievement?.level || 1;
  const totalXp = data?.achievement?.totalXp || 0;
  const currentLevelProgress = data?.currentLevelProgress || 0;

  return (
    <DashboardLayout title="Achievements & Streaks">
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs uppercase tracking-wider mb-1">
              <Trophy size={14} /> Habit Adherence & Gamification
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Health Streaks & Achievements
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-2xl border border-amber-200/80 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-extrabold text-sm">
            <Zap size={18} className="text-amber-500 fill-amber-500" />
            <span>{totalXp.toLocaleString()} Total XP</span>
          </div>
        </div>

        <DisclaimerBanner />

        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton variant="card" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Level Progression Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-amber-600 via-primary-600 to-indigo-600 text-white shadow-xl shadow-primary-500/15">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
                    <Star size={14} /> Vitality Tier
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    Level {level} — {level >= 5 ? 'Vitality Master' : level >= 3 ? 'Wellness Guardian' : 'Health Explorer'}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs text-amber-100 block font-semibold">Progress to Level {level + 1}</span>
                  <span className="text-xl font-black">{currentLevelProgress} / 250 XP</span>
                </div>
              </div>

              <div className="w-full bg-black/20 rounded-full h-3 p-0.5 backdrop-blur-md">
                <div
                  className="bg-gradient-to-r from-amber-300 to-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((currentLevelProgress / 250) * 100))}%` }}
                />
              </div>
            </div>

            {/* Streak Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Daily Logging Streak */}
              <Card glass className="p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-semibold text-rose-500 mb-2">
                  <span className="flex items-center gap-1"><Flame size={16} className="fill-rose-500" /> Daily Logging</span>
                  <span>Record: {streaks?.dailyTracking?.longest || 0}d</span>
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white my-1">
                  {streaks?.dailyTracking?.current || 0} <span className="text-xs font-semibold text-gray-400">days</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  Consecutive tracking streak
                </div>
              </Card>

              {/* Hydration Goal */}
              <Card glass className="p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-500 mb-2">
                  <span className="flex items-center gap-1"><Droplet size={16} className="fill-cyan-500" /> Water Streak</span>
                  <span>Record: {streaks?.hydrationGoal?.longest || 0}d</span>
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white my-1">
                  {streaks?.hydrationGoal?.current || 0} <span className="text-xs font-semibold text-gray-400">days</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  Target fluid intake achieved
                </div>
              </Card>

              {/* Sleep Goal */}
              <Card glass className="p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-500 mb-2">
                  <span className="flex items-center gap-1"><Moon size={16} className="fill-indigo-500" /> Sleep Streak</span>
                  <span>Record: {streaks?.sleepGoal?.longest || 0}d</span>
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white my-1">
                  {streaks?.sleepGoal?.current || 0} <span className="text-xs font-semibold text-gray-400">days</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  7+ hours restorative rest
                </div>
              </Card>

              {/* Steps Streak */}
              <Card glass className="p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-500 mb-2">
                  <span className="flex items-center gap-1"><Activity size={16} /> Movement</span>
                  <span>Record: {streaks?.stepsGoal?.longest || 0}d</span>
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white my-1">
                  {streaks?.stepsGoal?.current || 0} <span className="text-xs font-semibold text-gray-400">days</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  Daily step targets logged
                </div>
              </Card>
            </div>

            {/* Badges Grid */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award size={18} className="text-amber-500" /> Milestone Achievement Badges
                </h2>
                <span className="text-xs text-gray-400">
                  {data?.allBadges.filter(b => b.isUnlocked).length} of {data?.allBadges.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data?.allBadges.map((badge) => {
                  const isUnlocked = badge.isUnlocked;

                  return (
                    <Card
                      key={badge.id}
                      glass
                      onClick={() => setSelectedBadge(badge)}
                      className={`p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        isUnlocked
                          ? 'border-amber-400/40 dark:border-amber-500/30 bg-gradient-to-b from-white/90 to-amber-50/20 dark:from-gray-900/90 dark:to-amber-950/10'
                          : 'opacity-60 bg-gray-50/50 dark:bg-gray-900/40 border-gray-200/50 dark:border-gray-800/50'
                      }`}
                    >
                      <div>
                        {/* Top: Icon & Tier */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isUnlocked
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 shadow-md'
                              : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                          }`}>
                            {isUnlocked ? getBadgeIcon(badge.icon) : <Lock size={20} />}
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getTierColor(badge.tier)}`}>
                            {badge.tier}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                          {badge.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                          {badge.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between mt-4">
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Zap size={12} className="fill-amber-500" /> +{badge.xpValue} XP
                        </span>

                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Locked</span>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Badge Detail Modal */}
            {selectedBadge && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedBadge(null)} />
                <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 z-10 text-center space-y-4">
                  <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                    selectedBadge.isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-500/30 animate-pulse'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                  }`}>
                    {selectedBadge.isUnlocked ? getBadgeIcon(selectedBadge.icon, 36) : <Lock size={32} />}
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getTierColor(selectedBadge.tier)}`}>
                      {selectedBadge.tier} Tier Milestone
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                      {selectedBadge.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedBadge.description}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
                    <Zap size={16} className="text-amber-500 fill-amber-500" />
                    <span>Reward: {selectedBadge.xpValue} Vitality XP Points</span>
                  </div>

                  {selectedBadge.unlockedAt && (
                    <div className="text-[11px] text-gray-400">
                      Unlocked on {new Date(selectedBadge.unlockedAt).toLocaleDateString()}
                    </div>
                  )}

                  <Button variant="outline" className="w-full mt-2" onClick={() => setSelectedBadge(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
