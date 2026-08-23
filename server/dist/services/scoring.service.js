import { Assessment } from '../models/Assessment.js';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { HealthGoal } from '../models/HealthGoal.js';
export const computeDynamicHealthScore = async (userId) => {
    // 1. Fetch latest assessment
    const latestAssessment = await Assessment.findOne({ userId }).sort({ createdAt: -1 });
    // 2. Fetch last 7 days daily tracking logs
    const trackingLogs = await DailyHealthTracking.find({ userId })
        .sort({ date: -1 })
        .limit(7);
    // 3. Fetch goals
    const goals = await HealthGoal.find({ userId });
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    if (!latestAssessment && trackingLogs.length === 0) {
        return {
            hasData: false,
            overallScore: 0,
            riskLevel: 'Moderate',
            changeExplanation: 'Complete your first health assessment or log daily tracking to calculate your dynamic health score.',
            subScores: {
                sleepScore: 0,
                hydrationScore: 0,
                activityScore: 0,
                nutritionScore: 0,
                lifestyleScore: 0
            },
            metrics: {
                avgSleep: 0,
                avgWater: 0,
                avgSteps: 0,
                bmi: 0,
                stressAverage: 0,
                goalsCompleted: 0,
                totalGoals: 0
            }
        };
    }
    // Calculate Sub-Scores from available real data
    let sleepScore = 80;
    let hydrationScore = 80;
    let activityScore = 75;
    let nutritionScore = 75;
    let lifestyleScore = 80;
    let avgSleep = latestAssessment?.lifestyle?.sleepHours || 7.5;
    let avgWater = latestAssessment?.lifestyle?.dailyWaterIntake || 2.5;
    let avgSteps = latestAssessment?.physicalActivity?.stepsPerDay || 6000;
    let avgStress = latestAssessment?.lifestyle?.stressLevel || 5;
    let bmi = latestAssessment?.calculations?.bmi || 22.5;
    if (trackingLogs.length > 0) {
        const totalSleep = trackingLogs.reduce((acc, log) => acc + (log.sleep?.totalSleep || 0), 0);
        const totalWater = trackingLogs.reduce((acc, log) => acc + (log.hydration?.waterConsumed || 0), 0);
        const totalSteps = trackingLogs.reduce((acc, log) => acc + (log.physicalActivity?.steps || 0), 0);
        const totalStress = trackingLogs.reduce((acc, log) => acc + (log.wellness?.stressLevel || 5), 0);
        avgSleep = Number((totalSleep / trackingLogs.length).toFixed(1));
        avgWater = Number((totalWater / trackingLogs.length).toFixed(1));
        avgSteps = Math.round(totalSteps / trackingLogs.length);
        avgStress = Number((totalStress / trackingLogs.length).toFixed(1));
    }
    // --- SLEEP SCORE (0-100) ---
    if (avgSleep >= 7 && avgSleep <= 9)
        sleepScore = 95;
    else if (avgSleep >= 6 && avgSleep < 7)
        sleepScore = 80;
    else if (avgSleep > 9 && avgSleep <= 10)
        sleepScore = 85;
    else if (avgSleep >= 5 && avgSleep < 6)
        sleepScore = 60;
    else
        sleepScore = 40;
    // --- HYDRATION SCORE (0-100) ---
    const waterTarget = latestAssessment?.calculations?.dailyWaterRequirement || 2.5;
    const hydrationRatio = avgWater / waterTarget;
    if (hydrationRatio >= 0.95)
        hydrationScore = 95;
    else if (hydrationRatio >= 0.8)
        hydrationScore = 85;
    else if (hydrationRatio >= 0.6)
        hydrationScore = 70;
    else if (hydrationRatio >= 0.4)
        hydrationScore = 50;
    else
        hydrationScore = 30;
    // --- ACTIVITY SCORE (0-100) ---
    if (avgSteps >= 10000)
        activityScore = 95;
    else if (avgSteps >= 8000)
        activityScore = 85;
    else if (avgSteps >= 6000)
        activityScore = 75;
    else if (avgSteps >= 4000)
        activityScore = 60;
    else
        activityScore = 45;
    // --- NUTRITION SCORE (0-100) ---
    let nutPoints = 80;
    if (trackingLogs.length > 0) {
        const fastFoodDays = trackingLogs.filter(l => l.nutrition?.fastFood).length;
        const highSugarDays = trackingLogs.filter(l => l.nutrition?.sugarIntake === 'high').length;
        const lowSugarDays = trackingLogs.filter(l => l.nutrition?.sugarIntake === 'low').length;
        nutPoints -= (fastFoodDays * 5);
        nutPoints -= (highSugarDays * 4);
        nutPoints += (lowSugarDays * 3);
    }
    else if (latestAssessment) {
        if (latestAssessment.nutrition?.fastFoodFrequency === 'daily')
            nutPoints -= 15;
        else if (latestAssessment.nutrition?.fastFoodFrequency === '2-3 times/week')
            nutPoints -= 8;
        if (latestAssessment.nutrition?.sugarIntake === 'high')
            nutPoints -= 10;
    }
    nutritionScore = Math.max(20, Math.min(100, nutPoints));
    // --- LIFESTYLE & STRESS SCORE (0-100) ---
    let lifePoints = 90;
    if (avgStress >= 8)
        lifePoints -= 25;
    else if (avgStress >= 6)
        lifePoints -= 15;
    else if (avgStress >= 4)
        lifePoints -= 5;
    if (latestAssessment?.lifestyle?.smoking === 'yes')
        lifePoints -= 25;
    if (latestAssessment?.lifestyle?.alcohol === 'frequently')
        lifePoints -= 15;
    else if (latestAssessment?.lifestyle?.alcohol === 'occasionally')
        lifePoints -= 5;
    if (bmi > 0) {
        if (bmi >= 30 || bmi < 18.5)
            lifePoints -= 15;
        else if (bmi >= 25)
            lifePoints -= 8;
    }
    // Bonus for goals completed
    if (goals.length > 0 && completedGoals > 0) {
        const goalBonus = Math.min(10, Math.round((completedGoals / goals.length) * 10));
        lifePoints += goalBonus;
    }
    lifestyleScore = Math.max(20, Math.min(100, lifePoints));
    // Overall Weighted Score:
    // Sleep 25%, Hydration 20%, Activity 25%, Nutrition 15%, Lifestyle 15%
    const calculatedOverall = Math.round((sleepScore * 0.25) +
        (hydrationScore * 0.20) +
        (activityScore * 0.25) +
        (nutritionScore * 0.15) +
        (lifestyleScore * 0.15));
    const finalScore = Math.max(10, Math.min(100, calculatedOverall));
    let riskLevel = 'Moderate';
    if (finalScore >= 80)
        riskLevel = 'Low';
    else if (finalScore < 55)
        riskLevel = 'High';
    // Determine change explanation vs previous baseline
    let previousScore = latestAssessment?.calculations?.healthScore || finalScore;
    let delta = finalScore - previousScore;
    const reasons = [];
    if (sleepScore >= 85)
        reasons.push('healthy restorative sleep');
    else if (sleepScore < 65)
        reasons.push('insufficient sleep');
    if (hydrationScore >= 85)
        reasons.push('consistent hydration');
    else if (hydrationScore < 65)
        reasons.push('low water intake');
    if (activityScore >= 85)
        reasons.push('strong physical activity');
    else if (activityScore < 60)
        reasons.push('sedentary movement');
    if (completedGoals > 0)
        reasons.push('completed health goals');
    let explanation = '';
    if (delta > 0) {
        explanation = `Your score increased by ${delta} points due to ${reasons.slice(0, 2).join(' and ') || 'improved daily health habits'}.`;
    }
    else if (delta < 0) {
        explanation = `Your score decreased by ${Math.abs(delta)} points due to ${reasons.slice(0, 2).join(' and ') || 'variations in daily tracking'}.`;
    }
    else {
        explanation = `Your health score is stable at ${finalScore}/100 based on your current tracking habits.`;
    }
    return {
        hasData: true,
        overallScore: finalScore,
        riskLevel,
        previousScore,
        scoreChange: delta,
        changeExplanation: explanation,
        subScores: {
            sleepScore,
            hydrationScore,
            activityScore,
            nutritionScore,
            lifestyleScore
        },
        metrics: {
            avgSleep,
            avgWater,
            avgSteps,
            bmi,
            stressAverage: avgStress,
            goalsCompleted: completedGoals,
            totalGoals: goals.length
        }
    };
};
