import mongoose from 'mongoose';
export declare const Assessment: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    symptoms: string[];
    medicalHistory?: {
        diabetes: boolean;
        bloodPressure: boolean;
        heartDisease: boolean;
        asthma: boolean;
        thyroid: boolean;
        cholesterol: boolean;
        allergies: string;
    } | null | undefined;
    familyHistory?: {
        diabetes: boolean;
        heartDisease: boolean;
        cancer: boolean;
        hypertension: boolean;
        kidneyDisease: boolean;
    } | null | undefined;
    personalInfo?: {
        name: string;
        age: number;
        gender: "male" | "female" | "other" | "prefer not to say";
        height: number;
        weight: number;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    } | null | undefined;
    lifestyle?: {
        smoking: "yes" | "no";
        alcohol: "never" | "occasionally" | "frequently";
        dailyWaterIntake: number;
        sleepHours: number;
        wakeUpTime: string;
        bedTime: string;
        dailyScreenTime: number;
        stressLevel: number;
        occupation: string;
        workingHours: number;
    } | null | undefined;
    physicalActivity?: {
        dailyWalkingMinutes: number;
        stepsPerDay: number;
        exerciseFrequency: "never" | "1-2 times/week" | "3-4 times/week" | "5-6 times/week" | "daily";
        exerciseType: string;
        workoutDuration: number;
    } | null | undefined;
    nutrition?: {
        mealsPerDay: number;
        fruitsPerWeek: number;
        vegetablesPerWeek: number;
        fastFoodFrequency: "never" | "daily" | "once a week" | "2-3 times/week";
        sugarIntake: "low" | "moderate" | "high";
        waterIntake: number;
    } | null | undefined;
    calculations?: {
        bmi?: number | null | undefined;
        bmiCategory?: string | null | undefined;
        idealWeightMin?: number | null | undefined;
        idealWeightMax?: number | null | undefined;
        dailyWaterRequirement?: number | null | undefined;
        recommendedSleep?: number | null | undefined;
        caloriesNeeded?: number | null | undefined;
        activityLevel?: string | null | undefined;
        healthScore?: number | null | undefined;
        riskLevel?: string | null | undefined;
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        stressManagement: string[];
        lifestyleImprovements: string[];
        weeklyGoals: string[];
        preventiveHealthAdvice: string[];
        medicalCheckupSuggestions: string[];
        healthScore?: number | null | undefined;
        overallHealthSummary?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
        dietPlan?: {
            breakfast: string[];
            lunch: string[];
            dinner: string[];
            snacks: string[];
            avoidFoods: string[];
            healthyFoods: string[];
            proteinTips?: string | null | undefined;
            fiberTips?: string | null | undefined;
            sugarReduction?: string | null | undefined;
        } | null | undefined;
        exercisePlan?: {
            beginner: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            intermediate: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            advanced: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
        } | null | undefined;
        sleepAnalysis?: {
            tips: string[];
            quality?: string | null | undefined;
            idealBedTime?: string | null | undefined;
            idealWakeTime?: string | null | undefined;
        } | null | undefined;
        hydrationAnalysis?: {
            tips: string[];
            goal?: number | null | undefined;
            current?: number | null | undefined;
            remaining?: number | null | undefined;
        } | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    symptoms: string[];
    medicalHistory?: {
        diabetes: boolean;
        bloodPressure: boolean;
        heartDisease: boolean;
        asthma: boolean;
        thyroid: boolean;
        cholesterol: boolean;
        allergies: string;
    } | null | undefined;
    familyHistory?: {
        diabetes: boolean;
        heartDisease: boolean;
        cancer: boolean;
        hypertension: boolean;
        kidneyDisease: boolean;
    } | null | undefined;
    personalInfo?: {
        name: string;
        age: number;
        gender: "male" | "female" | "other" | "prefer not to say";
        height: number;
        weight: number;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    } | null | undefined;
    lifestyle?: {
        smoking: "yes" | "no";
        alcohol: "never" | "occasionally" | "frequently";
        dailyWaterIntake: number;
        sleepHours: number;
        wakeUpTime: string;
        bedTime: string;
        dailyScreenTime: number;
        stressLevel: number;
        occupation: string;
        workingHours: number;
    } | null | undefined;
    physicalActivity?: {
        dailyWalkingMinutes: number;
        stepsPerDay: number;
        exerciseFrequency: "never" | "1-2 times/week" | "3-4 times/week" | "5-6 times/week" | "daily";
        exerciseType: string;
        workoutDuration: number;
    } | null | undefined;
    nutrition?: {
        mealsPerDay: number;
        fruitsPerWeek: number;
        vegetablesPerWeek: number;
        fastFoodFrequency: "never" | "daily" | "once a week" | "2-3 times/week";
        sugarIntake: "low" | "moderate" | "high";
        waterIntake: number;
    } | null | undefined;
    calculations?: {
        bmi?: number | null | undefined;
        bmiCategory?: string | null | undefined;
        idealWeightMin?: number | null | undefined;
        idealWeightMax?: number | null | undefined;
        dailyWaterRequirement?: number | null | undefined;
        recommendedSleep?: number | null | undefined;
        caloriesNeeded?: number | null | undefined;
        activityLevel?: string | null | undefined;
        healthScore?: number | null | undefined;
        riskLevel?: string | null | undefined;
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        stressManagement: string[];
        lifestyleImprovements: string[];
        weeklyGoals: string[];
        preventiveHealthAdvice: string[];
        medicalCheckupSuggestions: string[];
        healthScore?: number | null | undefined;
        overallHealthSummary?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
        dietPlan?: {
            breakfast: string[];
            lunch: string[];
            dinner: string[];
            snacks: string[];
            avoidFoods: string[];
            healthyFoods: string[];
            proteinTips?: string | null | undefined;
            fiberTips?: string | null | undefined;
            sugarReduction?: string | null | undefined;
        } | null | undefined;
        exercisePlan?: {
            beginner: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            intermediate: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            advanced: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
        } | null | undefined;
        sleepAnalysis?: {
            tips: string[];
            quality?: string | null | undefined;
            idealBedTime?: string | null | undefined;
            idealWakeTime?: string | null | undefined;
        } | null | undefined;
        hydrationAnalysis?: {
            tips: string[];
            goal?: number | null | undefined;
            current?: number | null | undefined;
            remaining?: number | null | undefined;
        } | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    userId: mongoose.Types.ObjectId;
    symptoms: string[];
    medicalHistory?: {
        diabetes: boolean;
        bloodPressure: boolean;
        heartDisease: boolean;
        asthma: boolean;
        thyroid: boolean;
        cholesterol: boolean;
        allergies: string;
    } | null | undefined;
    familyHistory?: {
        diabetes: boolean;
        heartDisease: boolean;
        cancer: boolean;
        hypertension: boolean;
        kidneyDisease: boolean;
    } | null | undefined;
    personalInfo?: {
        name: string;
        age: number;
        gender: "male" | "female" | "other" | "prefer not to say";
        height: number;
        weight: number;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    } | null | undefined;
    lifestyle?: {
        smoking: "yes" | "no";
        alcohol: "never" | "occasionally" | "frequently";
        dailyWaterIntake: number;
        sleepHours: number;
        wakeUpTime: string;
        bedTime: string;
        dailyScreenTime: number;
        stressLevel: number;
        occupation: string;
        workingHours: number;
    } | null | undefined;
    physicalActivity?: {
        dailyWalkingMinutes: number;
        stepsPerDay: number;
        exerciseFrequency: "never" | "1-2 times/week" | "3-4 times/week" | "5-6 times/week" | "daily";
        exerciseType: string;
        workoutDuration: number;
    } | null | undefined;
    nutrition?: {
        mealsPerDay: number;
        fruitsPerWeek: number;
        vegetablesPerWeek: number;
        fastFoodFrequency: "never" | "daily" | "once a week" | "2-3 times/week";
        sugarIntake: "low" | "moderate" | "high";
        waterIntake: number;
    } | null | undefined;
    calculations?: {
        bmi?: number | null | undefined;
        bmiCategory?: string | null | undefined;
        idealWeightMin?: number | null | undefined;
        idealWeightMax?: number | null | undefined;
        dailyWaterRequirement?: number | null | undefined;
        recommendedSleep?: number | null | undefined;
        caloriesNeeded?: number | null | undefined;
        activityLevel?: string | null | undefined;
        healthScore?: number | null | undefined;
        riskLevel?: string | null | undefined;
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        stressManagement: string[];
        lifestyleImprovements: string[];
        weeklyGoals: string[];
        preventiveHealthAdvice: string[];
        medicalCheckupSuggestions: string[];
        healthScore?: number | null | undefined;
        overallHealthSummary?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
        dietPlan?: {
            breakfast: string[];
            lunch: string[];
            dinner: string[];
            snacks: string[];
            avoidFoods: string[];
            healthyFoods: string[];
            proteinTips?: string | null | undefined;
            fiberTips?: string | null | undefined;
            sugarReduction?: string | null | undefined;
        } | null | undefined;
        exercisePlan?: {
            beginner: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            intermediate: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            advanced: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
        } | null | undefined;
        sleepAnalysis?: {
            tips: string[];
            quality?: string | null | undefined;
            idealBedTime?: string | null | undefined;
            idealWakeTime?: string | null | undefined;
        } | null | undefined;
        hydrationAnalysis?: {
            tips: string[];
            goal?: number | null | undefined;
            current?: number | null | undefined;
            remaining?: number | null | undefined;
        } | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    symptoms: string[];
    medicalHistory?: {
        diabetes: boolean;
        bloodPressure: boolean;
        heartDisease: boolean;
        asthma: boolean;
        thyroid: boolean;
        cholesterol: boolean;
        allergies: string;
    } | null | undefined;
    familyHistory?: {
        diabetes: boolean;
        heartDisease: boolean;
        cancer: boolean;
        hypertension: boolean;
        kidneyDisease: boolean;
    } | null | undefined;
    personalInfo?: {
        name: string;
        age: number;
        gender: "male" | "female" | "other" | "prefer not to say";
        height: number;
        weight: number;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    } | null | undefined;
    lifestyle?: {
        smoking: "yes" | "no";
        alcohol: "never" | "occasionally" | "frequently";
        dailyWaterIntake: number;
        sleepHours: number;
        wakeUpTime: string;
        bedTime: string;
        dailyScreenTime: number;
        stressLevel: number;
        occupation: string;
        workingHours: number;
    } | null | undefined;
    physicalActivity?: {
        dailyWalkingMinutes: number;
        stepsPerDay: number;
        exerciseFrequency: "never" | "1-2 times/week" | "3-4 times/week" | "5-6 times/week" | "daily";
        exerciseType: string;
        workoutDuration: number;
    } | null | undefined;
    nutrition?: {
        mealsPerDay: number;
        fruitsPerWeek: number;
        vegetablesPerWeek: number;
        fastFoodFrequency: "never" | "daily" | "once a week" | "2-3 times/week";
        sugarIntake: "low" | "moderate" | "high";
        waterIntake: number;
    } | null | undefined;
    calculations?: {
        bmi?: number | null | undefined;
        bmiCategory?: string | null | undefined;
        idealWeightMin?: number | null | undefined;
        idealWeightMax?: number | null | undefined;
        dailyWaterRequirement?: number | null | undefined;
        recommendedSleep?: number | null | undefined;
        caloriesNeeded?: number | null | undefined;
        activityLevel?: string | null | undefined;
        healthScore?: number | null | undefined;
        riskLevel?: string | null | undefined;
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        stressManagement: string[];
        lifestyleImprovements: string[];
        weeklyGoals: string[];
        preventiveHealthAdvice: string[];
        medicalCheckupSuggestions: string[];
        healthScore?: number | null | undefined;
        overallHealthSummary?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
        dietPlan?: {
            breakfast: string[];
            lunch: string[];
            dinner: string[];
            snacks: string[];
            avoidFoods: string[];
            healthyFoods: string[];
            proteinTips?: string | null | undefined;
            fiberTips?: string | null | undefined;
            sugarReduction?: string | null | undefined;
        } | null | undefined;
        exercisePlan?: {
            beginner: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            intermediate: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            advanced: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
        } | null | undefined;
        sleepAnalysis?: {
            tips: string[];
            quality?: string | null | undefined;
            idealBedTime?: string | null | undefined;
            idealWakeTime?: string | null | undefined;
        } | null | undefined;
        hydrationAnalysis?: {
            tips: string[];
            goal?: number | null | undefined;
            current?: number | null | undefined;
            remaining?: number | null | undefined;
        } | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    symptoms: string[];
    medicalHistory?: {
        diabetes: boolean;
        bloodPressure: boolean;
        heartDisease: boolean;
        asthma: boolean;
        thyroid: boolean;
        cholesterol: boolean;
        allergies: string;
    } | null | undefined;
    familyHistory?: {
        diabetes: boolean;
        heartDisease: boolean;
        cancer: boolean;
        hypertension: boolean;
        kidneyDisease: boolean;
    } | null | undefined;
    personalInfo?: {
        name: string;
        age: number;
        gender: "male" | "female" | "other" | "prefer not to say";
        height: number;
        weight: number;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    } | null | undefined;
    lifestyle?: {
        smoking: "yes" | "no";
        alcohol: "never" | "occasionally" | "frequently";
        dailyWaterIntake: number;
        sleepHours: number;
        wakeUpTime: string;
        bedTime: string;
        dailyScreenTime: number;
        stressLevel: number;
        occupation: string;
        workingHours: number;
    } | null | undefined;
    physicalActivity?: {
        dailyWalkingMinutes: number;
        stepsPerDay: number;
        exerciseFrequency: "never" | "1-2 times/week" | "3-4 times/week" | "5-6 times/week" | "daily";
        exerciseType: string;
        workoutDuration: number;
    } | null | undefined;
    nutrition?: {
        mealsPerDay: number;
        fruitsPerWeek: number;
        vegetablesPerWeek: number;
        fastFoodFrequency: "never" | "daily" | "once a week" | "2-3 times/week";
        sugarIntake: "low" | "moderate" | "high";
        waterIntake: number;
    } | null | undefined;
    calculations?: {
        bmi?: number | null | undefined;
        bmiCategory?: string | null | undefined;
        idealWeightMin?: number | null | undefined;
        idealWeightMax?: number | null | undefined;
        dailyWaterRequirement?: number | null | undefined;
        recommendedSleep?: number | null | undefined;
        caloriesNeeded?: number | null | undefined;
        activityLevel?: string | null | undefined;
        healthScore?: number | null | undefined;
        riskLevel?: string | null | undefined;
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        stressManagement: string[];
        lifestyleImprovements: string[];
        weeklyGoals: string[];
        preventiveHealthAdvice: string[];
        medicalCheckupSuggestions: string[];
        healthScore?: number | null | undefined;
        overallHealthSummary?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
        dietPlan?: {
            breakfast: string[];
            lunch: string[];
            dinner: string[];
            snacks: string[];
            avoidFoods: string[];
            healthyFoods: string[];
            proteinTips?: string | null | undefined;
            fiberTips?: string | null | undefined;
            sugarReduction?: string | null | undefined;
        } | null | undefined;
        exercisePlan?: {
            beginner: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            intermediate: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            advanced: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
        } | null | undefined;
        sleepAnalysis?: {
            tips: string[];
            quality?: string | null | undefined;
            idealBedTime?: string | null | undefined;
            idealWakeTime?: string | null | undefined;
        } | null | undefined;
        hydrationAnalysis?: {
            tips: string[];
            goal?: number | null | undefined;
            current?: number | null | undefined;
            remaining?: number | null | undefined;
        } | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    symptoms: string[];
    medicalHistory?: {
        diabetes: boolean;
        bloodPressure: boolean;
        heartDisease: boolean;
        asthma: boolean;
        thyroid: boolean;
        cholesterol: boolean;
        allergies: string;
    } | null | undefined;
    familyHistory?: {
        diabetes: boolean;
        heartDisease: boolean;
        cancer: boolean;
        hypertension: boolean;
        kidneyDisease: boolean;
    } | null | undefined;
    personalInfo?: {
        name: string;
        age: number;
        gender: "male" | "female" | "other" | "prefer not to say";
        height: number;
        weight: number;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    } | null | undefined;
    lifestyle?: {
        smoking: "yes" | "no";
        alcohol: "never" | "occasionally" | "frequently";
        dailyWaterIntake: number;
        sleepHours: number;
        wakeUpTime: string;
        bedTime: string;
        dailyScreenTime: number;
        stressLevel: number;
        occupation: string;
        workingHours: number;
    } | null | undefined;
    physicalActivity?: {
        dailyWalkingMinutes: number;
        stepsPerDay: number;
        exerciseFrequency: "never" | "1-2 times/week" | "3-4 times/week" | "5-6 times/week" | "daily";
        exerciseType: string;
        workoutDuration: number;
    } | null | undefined;
    nutrition?: {
        mealsPerDay: number;
        fruitsPerWeek: number;
        vegetablesPerWeek: number;
        fastFoodFrequency: "never" | "daily" | "once a week" | "2-3 times/week";
        sugarIntake: "low" | "moderate" | "high";
        waterIntake: number;
    } | null | undefined;
    calculations?: {
        bmi?: number | null | undefined;
        bmiCategory?: string | null | undefined;
        idealWeightMin?: number | null | undefined;
        idealWeightMax?: number | null | undefined;
        dailyWaterRequirement?: number | null | undefined;
        recommendedSleep?: number | null | undefined;
        caloriesNeeded?: number | null | undefined;
        activityLevel?: string | null | undefined;
        healthScore?: number | null | undefined;
        riskLevel?: string | null | undefined;
    } | null | undefined;
    aiAnalysis?: {
        riskFactors: string[];
        stressManagement: string[];
        lifestyleImprovements: string[];
        weeklyGoals: string[];
        preventiveHealthAdvice: string[];
        medicalCheckupSuggestions: string[];
        healthScore?: number | null | undefined;
        overallHealthSummary?: string | null | undefined;
        whenToVisitDoctor?: string | null | undefined;
        dietPlan?: {
            breakfast: string[];
            lunch: string[];
            dinner: string[];
            snacks: string[];
            avoidFoods: string[];
            healthyFoods: string[];
            proteinTips?: string | null | undefined;
            fiberTips?: string | null | undefined;
            sugarReduction?: string | null | undefined;
        } | null | undefined;
        exercisePlan?: {
            beginner: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            intermediate: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
            advanced: mongoose.Types.DocumentArray<{
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }> & {
                name?: string | null | undefined;
                duration?: string | null | undefined;
                caloriesBurned?: string | null | undefined;
                frequency?: string | null | undefined;
                difficulty?: string | null | undefined;
            }>;
        } | null | undefined;
        sleepAnalysis?: {
            tips: string[];
            quality?: string | null | undefined;
            idealBedTime?: string | null | undefined;
            idealWakeTime?: string | null | undefined;
        } | null | undefined;
        hydrationAnalysis?: {
            tips: string[];
            goal?: number | null | undefined;
            current?: number | null | undefined;
            remaining?: number | null | undefined;
        } | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
