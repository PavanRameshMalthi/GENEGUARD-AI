import mongoose from 'mongoose';
import { HealthTimeline } from '../models/HealthTimeline.js';

export interface CreateTimelineEventInput {
  userId: mongoose.Types.ObjectId | string;
  eventType: 'assessment' | 'tracking' | 'score_change' | 'weight_change' | 'bmi_change' | 'exercise' | 'sleep' | 'hydration' | 'goal' | 'report' | 'weekly_report' | 'ai_analysis';
  title: string;
  description: string;
  category: 'assessments' | 'exercise' | 'sleep' | 'hydration' | 'reports' | 'goals' | 'general';
  data?: any;
  eventDate?: Date;
}

export const logTimelineEvent = async (input: CreateTimelineEventInput) => {
  try {
    return await HealthTimeline.create({
      userId: input.userId,
      eventType: input.eventType,
      title: input.title,
      description: input.description,
      category: input.category,
      data: input.data || {},
      eventDate: input.eventDate || new Date()
    });
  } catch (error) {
    console.error('Error logging health timeline event:', error);
    return null;
  }
};
