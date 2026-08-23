import mongoose from 'mongoose';
export interface IStructuredReportAnalysis {
    summary: string;
    importantFindings: string[];
    abnormalValues: string[];
    normalValues: string[];
    possibleConcerns: string[];
    questionsForDoctor: string[];
    recommendedFollowUp: string[];
    importantDates: string[];
}
export interface IReport extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileType: string;
    filePath: string;
    fileSize: number;
    reportType: string;
    status: 'pending' | 'analyzed' | 'failed';
    aiSummary?: string;
    structuredAnalysis?: IStructuredReportAnalysis;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Report: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport, {}, {}> & IReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
