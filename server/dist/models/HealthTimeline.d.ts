import mongoose from 'mongoose';
export interface IHealthTimeline extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    eventType: 'assessment' | 'tracking' | 'score_change' | 'weight_change' | 'bmi_change' | 'exercise' | 'sleep' | 'hydration' | 'goal' | 'report' | 'weekly_report' | 'ai_analysis';
    title: string;
    description: string;
    category: 'assessments' | 'exercise' | 'sleep' | 'hydration' | 'reports' | 'goals' | 'general';
    data?: any;
    eventDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const HealthTimeline: mongoose.Model<IHealthTimeline, {}, {}, {}, mongoose.Document<unknown, {}, IHealthTimeline, {}, {}> & IHealthTimeline & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
