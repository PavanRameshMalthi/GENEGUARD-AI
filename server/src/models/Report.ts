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

const reportSchema = new mongoose.Schema<IReport>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileName: { type: String, required: true, trim: true },
  fileType: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  reportType: { type: String, default: 'General Medical Report', trim: true },
  status: { 
    type: String, 
    enum: ['pending', 'analyzed', 'failed'], 
    default: 'pending' 
  },
  aiSummary: { type: String },
  structuredAnalysis: {
    summary: String,
    importantFindings: [String],
    abnormalValues: [String],
    normalValues: [String],
    possibleConcerns: [String],
    questionsForDoctor: [String],
    recommendedFollowUp: [String],
    importantDates: [String]
  }
}, { timestamps: true });

export const Report = mongoose.model<IReport>('Report', reportSchema);