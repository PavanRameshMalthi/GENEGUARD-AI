import mongoose from 'mongoose';
const weeklyHealthReportSchema = new mongoose.Schema({
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
export const WeeklyHealthReport = mongoose.model('WeeklyHealthReport', weeklyHealthReportSchema);
