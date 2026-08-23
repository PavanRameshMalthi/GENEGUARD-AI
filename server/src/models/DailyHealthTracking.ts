import mongoose from 'mongoose';

export interface IDailyHealthTracking extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  date: string; // 'YYYY-MM-DD'
  hydration: {
    waterConsumed: number; // in Liters
    waterGoal: number; // in Liters
    remainingWater: number; // in Liters
  };
  sleep: {
    bedtime: string; // 'HH:MM'
    wakeUpTime: string; // 'HH:MM'
    totalSleep: number; // in hours
    sleepGoal: number; // in hours
  };
  physicalActivity: {
    steps: number;
    walkingMinutes: number;
    exerciseType: string;
    exerciseDuration: number; // in minutes
  };
  nutrition: {
    mealsCount: number;
    mealsNotes?: string;
    fruitsServings: number;
    vegetablesServings: number;
    fastFood: boolean;
    sugarIntake: 'low' | 'moderate' | 'high';
  };
  wellness: {
    stressLevel: number; // 1-10
    mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
    energyLevel: number; // 1-10
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const dailyHealthTrackingSchema = new mongoose.Schema<IDailyHealthTracking>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  hydration: {
    waterConsumed: { type: Number, default: 0, min: 0, max: 20 },
    waterGoal: { type: Number, default: 2.5, min: 0.5, max: 20 },
    remainingWater: { type: Number, default: 2.5, min: 0 }
  },
  sleep: {
    bedtime: { type: String, default: '23:00' },
    wakeUpTime: { type: String, default: '07:00' },
    totalSleep: { type: Number, default: 0, min: 0, max: 24 },
    sleepGoal: { type: Number, default: 8, min: 4, max: 14 }
  },
  physicalActivity: {
    steps: { type: Number, default: 0, min: 0, max: 100000 },
    walkingMinutes: { type: Number, default: 0, min: 0, max: 1440 },
    exerciseType: { type: String, default: 'General Activity', trim: true },
    exerciseDuration: { type: Number, default: 0, min: 0, max: 1440 }
  },
  nutrition: {
    mealsCount: { type: Number, default: 3, min: 0, max: 10 },
    mealsNotes: { type: String, default: '', trim: true, maxlength: 500 },
    fruitsServings: { type: Number, default: 0, min: 0, max: 30 },
    vegetablesServings: { type: Number, default: 0, min: 0, max: 30 },
    fastFood: { type: Boolean, default: false },
    sugarIntake: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' }
  },
  wellness: {
    stressLevel: { type: Number, default: 5, min: 1, max: 10 },
    mood: { type: String, enum: ['great', 'good', 'neutral', 'tired', 'stressed'], default: 'good' },
    energyLevel: { type: Number, default: 7, min: 1, max: 10 },
    notes: { type: String, default: '', trim: true, maxlength: 1000 }
  }
}, { timestamps: true });

// Ensure unique log per user per date
dailyHealthTrackingSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyHealthTracking = mongoose.model<IDailyHealthTracking>('DailyHealthTracking', dailyHealthTrackingSchema);
