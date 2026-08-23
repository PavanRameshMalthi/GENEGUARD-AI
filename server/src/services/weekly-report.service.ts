import mongoose from 'mongoose';
import { WeeklyHealthReport, IWeeklyHealthReport } from '../models/WeeklyHealthReport.js';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { Assessment } from '../models/Assessment.js';
import { HealthGoal } from '../models/HealthGoal.js';
import { computeDynamicHealthScore } from './scoring.service.js';
import { logTimelineEvent } from './timeline.service.js';
import { createNotification } from './notification.service.js';
import { getGeminiClient, hasGeminiConfigured } from '../config/gemini.js';

export const generateWeeklyHealthReport = async (
  userId: string | mongoose.Types.ObjectId,
  targetEndDate?: Date
): Promise<{ success: boolean; report?: IWeeklyHealthReport; message?: string }> => {
  const endDate = targetEndDate || new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6); // 7 day period

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  // Fetch tracking logs within this 7-day window
  const trackingLogs = await DailyHealthTracking.find({
    userId,
    date: { $gte: startStr, $lte: endStr }
  }).sort({ date: 1 });

  // If user has less than 2 tracking logs or no assessment, return insufficient data notice
  const latestAssessment = await Assessment.findOne({ userId }).sort({ createdAt: -1 });

  if (trackingLogs.length < 2 && !latestAssessment) {
    return {
      success: false,
      message: 'Not enough health data to generate your weekly report. Track at least 2 days of daily health metrics to generate weekly summaries.'
    };
  }

  // Calculate actual averages
  let totalSleep = 0;
  let totalWater = 0;
  let totalSteps = 0;
  let totalExerciseMins = 0;
  let totalStress = 0;

  if (trackingLogs.length > 0) {
    trackingLogs.forEach(log => {
      totalSleep += log.sleep?.totalSleep || 0;
      totalWater += log.hydration?.waterConsumed || 0;
      totalSteps += log.physicalActivity?.steps || 0;
      totalExerciseMins += log.physicalActivity?.exerciseDuration || 0;
      totalStress += log.wellness?.stressLevel || 5;
    });
  } else if (latestAssessment) {
    totalSleep = latestAssessment.lifestyle?.sleepHours || 7.5;
    totalWater = latestAssessment.lifestyle?.dailyWaterIntake || 2.5;
    totalSteps = latestAssessment.physicalActivity?.stepsPerDay || 6000;
    totalExerciseMins = latestAssessment.physicalActivity?.workoutDuration || 30;
    totalStress = latestAssessment.lifestyle?.stressLevel || 5;
  }

  const dataCount = trackingLogs.length || 1;
  const avgSleep = Number((totalSleep / dataCount).toFixed(1));
  const avgWater = Number((totalWater / dataCount).toFixed(1));
  const avgSteps = Math.round(totalSteps / dataCount);
  const avgStress = Number((totalStress / dataCount).toFixed(1));
  const totalExercise = Math.round(totalExerciseMins);

  // Dynamic score
  const dynamicScore = await computeDynamicHealthScore(userId);
  const healthScore = dynamicScore.overallScore || 78;
  const scoreChange = dynamicScore.scoreChange || 0;

  // Goals completion
  const goals = await HealthGoal.find({ userId });
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const goalPercentage = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const bmi = latestAssessment?.calculations?.bmi || 22.5;
  const weight = latestAssessment?.personalInfo?.weight || 70;

  // Date range formatted
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const dateRangeFormatted = `${startDate.toLocaleDateString('en-US', options)} – ${endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;

  // Achievements, Areas to improve, Next week goals
  const achievements: string[] = [];
  const areasToImprove: string[] = [];
  const nextWeekGoals: string[] = [];

  if (avgSleep >= 7) {
    achievements.push(`Maintained optimal sleep average of ${avgSleep} hours/night.`);
  } else {
    areasToImprove.push(`Average sleep was ${avgSleep} hrs. Aim for 7-8 hours of restorative rest.`);
    nextWeekGoals.push('Establish a consistent 22:30 bedtime to improve sleep duration.');
  }

  if (avgWater >= 2.2) {
    achievements.push(`Hydration goal achieved with an average of ${avgWater} L/day.`);
  } else {
    areasToImprove.push(`Daily hydration averaged ${avgWater} L, below the recommended target.`);
    nextWeekGoals.push('Drink at least 2.5 Liters of water daily.');
  }

  if (avgSteps >= 8000) {
    achievements.push(`Strong physical activity: averaged ${avgSteps.toLocaleString()} daily steps.`);
  } else {
    areasToImprove.push(`Daily steps averaged ${avgSteps.toLocaleString()}. Increase walking intervals.`);
    nextWeekGoals.push('Hit 8,000 steps on at least 5 days next week.');
  }

  if (completedGoals > 0) {
    achievements.push(`Completed ${completedGoals} personal health goals.`);
  }

  if (achievements.length === 0) {
    achievements.push('Initiated daily health tracking and preventive baseline monitoring.');
  }
  if (nextWeekGoals.length === 0) {
    nextWeekGoals.push('Log all daily health metrics consistently for 7 consecutive days.');
    nextWeekGoals.push('Engage in at least 150 minutes of cumulative moderate exercise.');
  }

  // AI recommendations
  let aiRecommendations: string[] = [
    `Maintain hydration consistency throughout mornings to optimize metabolic efficiency.`,
    `Incorporate dynamic stretching breaks during sedentary working hours.`,
    `Prioritize nutrient-dense whole foods and limit processed sugars in evening meals.`
  ];

  if (hasGeminiConfigured()) {
    try {
      const client = getGeminiClient();
      if (client) {
        const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `As GeneGuard AI preventive health assistant, generate 3 concise, highly personalized preventive wellness tips for a weekly report based on these real 7-day metrics:
Average Sleep: ${avgSleep} hrs
Average Hydration: ${avgWater} L
Average Steps: ${avgSteps}
Total Exercise: ${totalExercise} mins
Average Stress: ${avgStress}/10
Health Score: ${healthScore}/100.
Return only a clean JSON array of strings without markdown formatting.`;

        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, responseMimeType: 'application/json' }
        });
        const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          aiRecommendations = parsed;
        }
      }
    } catch (err) {
      console.warn('Gemini weekly report recommendations fallback used:', err);
    }
  }

  // Create and persist Weekly Report
  const report = await WeeklyHealthReport.create({
    userId,
    weekStartDate: startDate,
    weekEndDate: endDate,
    dateRangeFormatted,
    healthScore,
    scoreChange,
    averageSleep: avgSleep,
    averageHydration: avgWater,
    averageSteps: avgSteps,
    totalExerciseMinutes: totalExercise,
    stressAverage: avgStress,
    goalCompletion: {
      total: goals.length,
      completed: completedGoals,
      percentage: goalPercentage
    },
    weightChange: 0,
    bmi,
    achievements,
    areasToImprove,
    nextWeekGoals,
    aiRecommendations,
    dataPointsCount: trackingLogs.length
  });

  // Log Timeline Event
  await logTimelineEvent({
    userId,
    eventType: 'weekly_report',
    title: 'Weekly Health Report Generated',
    description: `Weekly report for ${dateRangeFormatted} is ready. Health Score: ${healthScore}/100.`,
    category: 'reports',
    data: { reportId: report._id, healthScore, dateRangeFormatted }
  });

  // Notify User
  await createNotification({
    userId,
    title: 'Weekly Health Report Ready',
    message: `Your summary for ${dateRangeFormatted} is ready to view. Health Score: ${healthScore}/100.`,
    type: 'weekly',
    link: '/weekly-reports'
  });

  return { success: true, report };
};
