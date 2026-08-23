import mongoose from 'mongoose';

export interface IPreventiveEvent extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: 'screening' | 'vaccination' | 'doctor_visit' | 'lab_test' | 'medication_review' | 'lifestyle';
  description?: string;
  date: string; // 'YYYY-MM-DD'
  time?: string; // 'HH:MM'
  frequency: 'once' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  status: 'scheduled' | 'completed' | 'skipped' | 'overdue';
  doctorName?: string;
  location?: string;
  notes?: string;
  isAiRecommended?: boolean;
  riskFactorTag?: string;
  createdAt: Date;
  updatedAt: Date;
}

const preventiveEventSchema = new mongoose.Schema<IPreventiveEvent>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: [true, 'Event title is required'], trim: true, maxlength: 200 },
  category: {
    type: String,
    enum: ['screening', 'vaccination', 'doctor_visit', 'lab_test', 'medication_review', 'lifestyle'],
    default: 'screening'
  },
  description: { type: String, trim: true, maxlength: 1000 },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  time: { type: String, default: '09:00' },
  frequency: {
    type: String,
    enum: ['once', 'monthly', 'quarterly', 'semi-annual', 'annual'],
    default: 'annual'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'skipped', 'overdue'],
    default: 'scheduled'
  },
  doctorName: { type: String, trim: true, maxlength: 100 },
  location: { type: String, trim: true, maxlength: 200 },
  notes: { type: String, trim: true, maxlength: 1000 },
  isAiRecommended: { type: Boolean, default: false },
  riskFactorTag: { type: String, trim: true, maxlength: 100 }
}, { timestamps: true });

preventiveEventSchema.index({ userId: 1, date: 1 });

export const PreventiveEvent = mongoose.model<IPreventiveEvent>('PreventiveEvent', preventiveEventSchema);
