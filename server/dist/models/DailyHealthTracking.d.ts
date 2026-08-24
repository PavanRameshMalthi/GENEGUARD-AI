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
        quality?: string;
        wokeUpDuringNight?: boolean;
    };
    physicalActivity: {
        steps: number;
        walkingMinutes: number;
        exerciseType: string;
        exerciseDuration: number;
        exerciseIntensity?: string;
    };
    nutrition: {
        mealsCount: number;
        mealsNotes?: string;
        fruitsServings: number;
        vegetablesServings: number;
        fastFood: boolean | string;
        sugarIntake: 'low' | 'moderate' | 'high';
        proteinIntake?: number;
    };
    wellness: {
        stressLevel: number;
        mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed' | string;
        energyLevel: number;
        notes?: string;
        weight?: number;
        restingHeartRate?: number;
        screenTime?: number;
        overallFeeling?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const DailyHealthTracking: mongoose.Model<IDailyHealthTracking, {}, {}, {}, mongoose.Document<unknown, {}, IDailyHealthTracking, {}, {}> & IDailyHealthTracking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
