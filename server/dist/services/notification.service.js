import { Notification } from '../models/Notification.js';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { HealthGoal } from '../models/HealthGoal.js';
export const createNotification = async (input) => {
    try {
        // Avoid duplicate unread notifications with same title and type within recent time
        const existing = await Notification.findOne({
            userId: input.userId,
            title: input.title,
            type: input.type,
            isRead: false
        });
        if (existing) {
            existing.message = input.message;
            existing.link = input.link || existing.link;
            return await existing.save();
        }
        return await Notification.create({
            userId: input.userId,
            title: input.title,
            message: input.message,
            type: input.type,
            link: input.link,
            isRead: false
        });
    }
    catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};
export const checkAndGenerateActivityNotifications = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        // 1. Check if user logged today's tracking
        const todayTracking = await DailyHealthTracking.findOne({ userId, date: today });
        if (!todayTracking) {
            await createNotification({
                userId,
                title: 'Daily Tracking Incomplete',
                message: "You haven't logged your health metrics for today. Track your water, sleep, and steps to keep your score updated.",
                type: 'tracking',
                link: '/tracking'
            });
        }
        else {
            // Check hydration goal progress
            if (todayTracking.hydration.waterGoal > 0) {
                const ratio = todayTracking.hydration.waterConsumed / todayTracking.hydration.waterGoal;
                if (ratio >= 0.75 && ratio < 1.0) {
                    await createNotification({
                        userId,
                        title: 'Hydration Goal in Reach',
                        message: `You're at ${Math.round(ratio * 100)}% of your hydration target today (${todayTracking.hydration.waterConsumed} / ${todayTracking.hydration.waterGoal} L). Keep it up!`,
                        type: 'goal',
                        link: '/tracking'
                    });
                }
            }
        }
        // 2. Check active goals approaching deadline (within 2 days)
        const upcomingDeadline = new Date();
        upcomingDeadline.setDate(upcomingDeadline.getDate() + 2);
        const nearGoals = await HealthGoal.find({
            userId,
            status: 'In Progress',
            targetDate: { $lte: upcomingDeadline, $gte: new Date() }
        });
        for (const goal of nearGoals) {
            await createNotification({
                userId,
                title: 'Goal Deadline Approaching',
                message: `Your goal "${goal.title}" target date is approaching on ${new Date(goal.targetDate).toLocaleDateString()}. Current progress: ${goal.current} / ${goal.target} ${goal.unit}.`,
                type: 'goal',
                link: '/goals'
            });
        }
    }
    catch (error) {
        console.error('Error evaluating activity notifications:', error);
    }
};
