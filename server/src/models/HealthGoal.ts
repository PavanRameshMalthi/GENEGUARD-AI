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

const healthGoalSchema = new mongoose.Schema<IHealthGoal>({
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

export const HealthGoal = mongoose.model<IHealthGoal>('HealthGoal', healthGoalSchema);
