import mongoose from 'mongoose';

export interface IWeeklyHealthReport extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  weekStartDate: Date;
  weekEndDate: Date;
  dateRangeFormatted: string; // e.g. "August 17 - August 23, 2026"
  healthScore: number;
  scoreChange: number; // e.g. +4, -2
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

const weeklyHealthReportSchema = new mongoose.Schema<IWeeklyHealthReport>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  weekStartDate: { type: Date, required: true },
  weekEndDate: { type: Date, required: true },
  dateRangeFormatted: { type: String, required: true },
  healthScore: { type: Number, required: true, min: 0, max: 100 },
  scoreChange: { type: Number, default: 0 },
  averageSleep: { type: Number, required: true },
  averageHydration: { type: Number, required: true },
  averageSteps: { type: Number, required: true },
  totalExerciseMinutes: { type: Number, required: true },
  stressAverage: { type: Number, required: true },
  goalCompletion: {
    total: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  },
  weightChange: { type: Number, default: 0 },
  bmi: { type: Number, default: 0 },
  achievements: [{ type: String, trim: true }],
  areasToImprove: [{ type: String, trim: true }],
  nextWeekGoals: [{ type: String, trim: true }],
  aiRecommendations: [{ type: String, trim: true }],
  dataPointsCount: { type: Number, default: 0 }
}, { timestamps: true });

export const WeeklyHealthReport = mongoose.model<IWeeklyHealthReport>('WeeklyHealthReport', weeklyHealthReportSchema);
