import mongoose from 'mongoose';
const healthGoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: {
        type: String,
        enum: ['hydration', 'sleep', 'activity', 'nutrition', 'weight', 'general'],
        default: 'general'
    },
    target: { type: Number, required: true, min: 0 },
    current: { type: Number, default: 0, min: 0 },
    unit: { type: String, required: true, trim: true, maxlength: 50 },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'Overdue'],
        default: 'In Progress'
    }
}, { timestamps: true });
export const HealthGoal = mongoose.model('HealthGoal', healthGoalSchema);
