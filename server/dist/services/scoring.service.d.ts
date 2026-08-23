import mongoose from 'mongoose';
export interface DynamicScoreResult {
    hasData: boolean;
    overallScore: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    previousScore?: number;
    scoreChange?: number;
    changeExplanation: string;
    subScores: {
        sleepScore: number;
        hydrationScore: number;
        activityScore: number;
        nutritionScore: number;
        lifestyleScore: number;
    };
    metrics: {
        avgSleep: number;
        avgWater: number;
        avgSteps: number;
        bmi: number;
        stressAverage: number;
        goalsCompleted: number;
        totalGoals: number;
    };
}
export declare const computeDynamicHealthScore: (userId: string | mongoose.Types.ObjectId) => Promise<DynamicScoreResult>;
