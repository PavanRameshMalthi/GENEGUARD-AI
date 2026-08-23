import { Response } from 'express';
import { UserAchievement } from '../models/Achievement.js';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { Assessment } from '../models/Assessment.js';
import { Report } from '../models/Report.js';
import { HealthGoal } from '../models/HealthGoal.js';
import { formatResponse } from '../utils/helpers.js';

// Predefined system badges catalogue
export const SYSTEM_BADGES = [
  {
    id: 'assessment_ace',
    title: 'Health Assessment Pioneer',
    description: 'Completed your comprehensive clinical health assessment.',
    category: 'assessment',
    tier: 'gold',
    icon: 'ClipboardCheck',
    xpValue: 200
  },
  {
    id: 'hydration_hero',
    title: 'Hydration Hero',
    description: 'Achieved optimal daily water goal for 3+ logged days.',
    category: 'hydration',
    tier: 'bronze',
    icon: 'Droplet',
    xpValue: 100
  },
  {
    id: 'sleep_champion',
    title: 'Restorative Slumber',
    description: 'Logged 7+ hours of quality sleep for 3+ days.',
    category: 'sleep',
    tier: 'bronze',
    icon: 'Moon',
    xpValue: 100
  },
  {
    id: 'century_walker',
    title: 'Active Mover',
    description: 'Logged 8,000+ daily steps in physical activity.',
    category: 'activity',
    tier: 'silver',
    icon: 'Activity',
    xpValue: 150
  },
  {
    id: 'streak_master',
    title: 'Consistency Master',
    description: 'Maintained an active 5-day daily health tracking streak.',
    category: 'streak',
    tier: 'gold',
    icon: 'Flame',
    xpValue: 250
  },
  {
    id: 'report_guardian',
    title: 'Diagnostic Guardian',
    description: 'Uploaded and analyzed your first medical lab report.',
    category: 'mastery',
    tier: 'silver',
    icon: 'FileText',
    xpValue: 150
  },
  {
    id: 'goal_crusher',
    title: 'Goal Crusher',
    description: 'Successfully reached and completed an active health goal.',
    category: 'goals',
    tier: 'gold',
    icon: 'Target',
    xpValue: 300
  },
  {
    id: 'vitality_legend',
    title: 'Vitality Legend',
    description: 'Achieved a top-tier health score of 80 or above.',
    category: 'mastery',
    tier: 'platinum',
    icon: 'Award',
    xpValue: 500
  }
];

export const getAchievements = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;

    // Retrieve or initialize user achievement record
    let achievement = await UserAchievement.findOne({ userId });
    if (!achievement) {
      achievement = await UserAchievement.create({
        userId,
        streaks: {
          dailyTracking: { current: 0, longest: 0 },
          hydrationGoal: { current: 0, longest: 0 },
          sleepGoal: { current: 0, longest: 0 },
          stepsGoal: { current: 0, longest: 0 }
        },
        totalXp: 0,
        level: 1,
        unlockedBadges: []
      });
    }

    // Evaluate streaks and badge unlocks from real user telemetry
    const [trackingHistory, assessments, reports, goals] = await Promise.all([
      DailyHealthTracking.find({ userId }).sort({ date: -1 }).limit(30),
      Assessment.find({ userId }).sort({ createdAt: -1 }),
      Report.find({ userId }),
      HealthGoal.find({ userId })
    ]);

    // Calculate daily logging streak
    let currentStreak = 0;
    if (trackingHistory.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const firstDate = trackingHistory[0].date;

      if (firstDate === today || firstDate === yesterday) {
        currentStreak = 1;
        for (let i = 0; i < trackingHistory.length - 1; i++) {
          const d1 = new Date(trackingHistory[i].date);
          const d2 = new Date(trackingHistory[i + 1].date);
          const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    achievement.streaks.dailyTracking.current = currentStreak;
    if (currentStreak > (achievement.streaks.dailyTracking.longest || 0)) {
      achievement.streaks.dailyTracking.longest = currentStreak;
    }

    // Evaluate Unlocked Badges
    const unlockedMap = new Map(achievement.unlockedBadges.map(b => [b.id, b]));

    const checkAndUnlock = (badgeId: string, condition: boolean) => {
      if (condition && !unlockedMap.has(badgeId)) {
        const badgeDef = SYSTEM_BADGES.find(b => b.id === badgeId);
        if (badgeDef) {
          unlockedMap.set(badgeId, {
            ...badgeDef,
            unlockedAt: new Date()
          } as any);
        }
      }
    };

    // Rule 1: Assessment ace
    checkAndUnlock('assessment_ace', assessments.length > 0);

    // Rule 2: Hydration hero (3+ days meeting water goal)
    const hydrationDays = trackingHistory.filter(t => (t.hydration?.waterConsumed || 0) >= (t.hydration?.waterGoal || 2.5)).length;
    checkAndUnlock('hydration_hero', hydrationDays >= 3);

    // Rule 3: Sleep champion (3+ days 7h+ sleep)
    const sleepDays = trackingHistory.filter(t => (t.sleep?.totalSleep || 0) >= 7).length;
    checkAndUnlock('sleep_champion', sleepDays >= 3);

    // Rule 4: Century walker (Any day 8k+ steps)
    const activeSteps = trackingHistory.some(t => (t.physicalActivity?.steps || 0) >= 8000);
    checkAndUnlock('century_walker', activeSteps);

    // Rule 5: Streak master (5+ days streak)
    checkAndUnlock('streak_master', currentStreak >= 5);

    // Rule 6: Report guardian
    checkAndUnlock('report_guardian', reports.length > 0);

    // Rule 7: Goal crusher
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    checkAndUnlock('goal_crusher', completedGoals >= 1);

    // Rule 8: Vitality legend (Score >= 80)
    const highScore = assessments.some(a => (a.calculations?.healthScore || 0) >= 80);
    checkAndUnlock('vitality_legend', highScore);

    achievement.unlockedBadges = Array.from(unlockedMap.values());

    // Calculate XP and Level
    const badgeXp = achievement.unlockedBadges.reduce((acc, b) => acc + (b.xpValue || 50), 0);
    const trackingXp = trackingHistory.length * 20;
    const totalXp = badgeXp + trackingXp;

    achievement.totalXp = totalXp;
    achievement.level = Math.max(1, Math.floor(totalXp / 250) + 1);

    await achievement.save();

    res.json(formatResponse(true, {
      achievement,
      allBadges: SYSTEM_BADGES.map(b => ({
        ...b,
        isUnlocked: unlockedMap.has(b.id),
        unlockedAt: unlockedMap.get(b.id)?.unlockedAt
      })),
      nextLevelXp: achievement.level * 250,
      currentLevelProgress: totalXp % 250
    }));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};
