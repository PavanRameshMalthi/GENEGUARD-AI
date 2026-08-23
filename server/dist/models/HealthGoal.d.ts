import mongoose from 'mongoose';
export interface IHealthGoal extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    category: 'hydration' | 'sleep' | 'activity' | 'nutrition' | 'weight' | 'general';
    target: number;
    current: number;
    unit: string;
    startDate: Date;
    targetDate: Date;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
    createdAt: Date;
    updatedAt: Date;
}
export declare const HealthGoal: mongoose.Model<IHealthGoal, {}, {}, {}, mongoose.Document<unknown, {}, IHealthGoal, {}, {}> & IHealthGoal & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
