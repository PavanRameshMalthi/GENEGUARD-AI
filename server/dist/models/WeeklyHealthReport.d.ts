import mongoose from 'mongoose';
export interface IWeeklyHealthReport extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    weekStartDate: Date;
    weekEndDate: Date;
    dateRangeFormatted: string;
    healthScore: number;
    scoreChange: number;
    averageSleep: number;
    averageHydration: number;
    averageSteps: number;
    totalExerciseMinutes: number;
    stressAverage: number;
    goalCompletion: {
        total: number;
        completed: number;
        percentage: number;
    };
    weightChange: number;
    bmi: number;
    achievements: string[];
    areasToImprove: string[];
    nextWeekGoals: string[];
    aiRecommendations: string[];
    dataPointsCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const WeeklyHealthReport: mongoose.Model<IWeeklyHealthReport, {}, {}, {}, mongoose.Document<unknown, {}, IWeeklyHealthReport, {}, {}> & IWeeklyHealthReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
