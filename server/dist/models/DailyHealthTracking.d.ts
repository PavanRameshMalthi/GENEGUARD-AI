import mongoose from 'mongoose';
export interface IDailyHealthTracking extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    date: string;
    hydration: {
        waterConsumed: number;
        waterGoal: number;
        remainingWater: number;
    };
    sleep: {
        bedtime: string;
        wakeUpTime: string;
        totalSleep: number;
        sleepGoal: number;
    };
    physicalActivity: {
        steps: number;
        walkingMinutes: number;
        exerciseType: string;
        exerciseDuration: number;
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
        stressLevel: number;
        mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
        energyLevel: number;
        notes?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const DailyHealthTracking: mongoose.Model<IDailyHealthTracking, {}, {}, {}, mongoose.Document<unknown, {}, IDailyHealthTracking, {}, {}> & IDailyHealthTracking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
