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

const healthTimelineSchema = new mongoose.Schema<IHealthTimeline>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  eventType: { 
    type: String, 
    required: true,
    enum: [
      'assessment', 
      'tracking', 
      'score_change', 
      'weight_change', 
      'bmi_change', 
      'exercise', 
      'sleep', 
      'hydration', 
      'goal', 
      'report', 
      'weekly_report', 
      'ai_analysis'
    ]
  },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  category: { 
    type: String, 
    required: true,
    enum: ['assessments', 'exercise', 'sleep', 'hydration', 'reports', 'goals', 'general'],
    default: 'general'
  },
  data: { type: mongoose.Schema.Types.Mixed },
  eventDate: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

export const HealthTimeline = mongoose.model<IHealthTimeline>('HealthTimeline', healthTimelineSchema);
