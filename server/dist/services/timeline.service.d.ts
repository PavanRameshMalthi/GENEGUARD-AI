import mongoose from 'mongoose';
export interface CreateTimelineEventInput {
    userId: mongoose.Types.ObjectId | string;
    eventType: 'assessment' | 'tracking' | 'score_change' | 'weight_change' | 'bmi_change' | 'exercise' | 'sleep' | 'hydration' | 'goal' | 'report' | 'weekly_report' | 'ai_analysis';
    title: string;
    description: string;
    category: 'assessments' | 'exercise' | 'sleep' | 'hydration' | 'reports' | 'goals' | 'general';
    data?: any;
    eventDate?: Date;
}
export declare const logTimelineEvent: (input: CreateTimelineEventInput) => Promise<(mongoose.Document<unknown, {}, import("../models/HealthTimeline.js").IHealthTimeline, {}, {}> & import("../models/HealthTimeline.js").IHealthTimeline & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
