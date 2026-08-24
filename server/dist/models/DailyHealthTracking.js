import mongoose from 'mongoose';
const dailyHealthTrackingSchema = new mongoose.Schema({
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
        sleepGoal: { type: Number, default: 8, min: 4, max: 14 },
        quality: { type: String, default: 'good' },
        wokeUpDuringNight: { type: Boolean, default: false }
    },
    physicalActivity: {
        steps: { type: Number, default: 0, min: 0, max: 100000 },
        walkingMinutes: { type: Number, default: 0, min: 0, max: 1440 },
        exerciseType: { type: String, default: 'General Activity', trim: true },
        exerciseDuration: { type: Number, default: 0, min: 0, max: 1440 },
        exerciseIntensity: { type: String, default: 'moderate' }
    },
    nutrition: {
        mealsCount: { type: Number, default: 3, min: 0, max: 10 },
        mealsNotes: { type: String, default: '', trim: true, maxlength: 500 },
        fruitsServings: { type: Number, default: 0, min: 0, max: 30 },
        vegetablesServings: { type: Number, default: 0, min: 0, max: 30 },
        fastFood: { type: mongoose.Schema.Types.Mixed, default: false },
        sugarIntake: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
        proteinIntake: { type: Number, default: 0, min: 0, max: 500 }
    },
    wellness: {
        stressLevel: { type: Number, default: 5, min: 1, max: 10 },
        mood: { type: String, default: 'good' },
        energyLevel: { type: Number, default: 7, min: 1, max: 10 },
        notes: { type: String, default: '', trim: true, maxlength: 1000 },
        weight: { type: Number, min: 0, max: 500 },
        restingHeartRate: { type: Number, min: 0, max: 250 },
        screenTime: { type: Number, default: 0, min: 0, max: 24 },
        overallFeeling: { type: String, default: 'good' }
    }
}, { timestamps: true });
// Ensure unique log per user per date
dailyHealthTrackingSchema.index({ userId: 1, date: 1 }, { unique: true });
export const DailyHealthTracking = mongoose.model('DailyHealthTracking', dailyHealthTrackingSchema);
