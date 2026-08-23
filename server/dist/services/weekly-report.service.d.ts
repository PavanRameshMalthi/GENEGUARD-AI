import mongoose from 'mongoose';
import { IWeeklyHealthReport } from '../models/WeeklyHealthReport.js';
export declare const generateWeeklyHealthReport: (userId: string | mongoose.Types.ObjectId, targetEndDate?: Date) => Promise<{
    success: boolean;
    report?: IWeeklyHealthReport;
    message?: string;
}>;
