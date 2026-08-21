export interface CalculationInput {
    age: number;
    gender: string;
    height: number;
    weight: number;
    sleepHours: number;
    dailyWaterIntake: number;
    stressLevel: number;
    smoking: string;
    alcohol: string;
    stepsPerDay: number;
    exerciseFrequency: string;
    workoutDuration: number;
    workingHours: number;
    mealsPerDay: number;
    fruitsPerWeek: number;
    vegetablesPerWeek: number;
    fastFoodFrequency: string;
    sugarIntake: string;
    medicalConditions: string[];
    familyConditions: string[];
    symptoms: string[];
}
export declare function calculateBMI(height: number, weight: number): number;
export declare function getBMICategory(bmi: number): string;
export declare function getIdealWeightRange(height: number): {
    min: number;
    max: number;
};
export declare function calculateDailyWaterRequirement(weight: number, activityLevel: string): number;
export declare function getRecommendedSleep(age: number): number;
export declare function calculateCalories(age: number, gender: string, height: number, weight: number, activityLevel: string): number;
export declare function getActivityLevel(stepsPerDay?: number, exerciseFrequency?: string, workingHours?: number): string;
export declare function calculateHealthScore(input: CalculationInput): number;
export declare function getRiskLevel(healthScore: number, medicalConditions?: string[], familyConditions?: string[]): string;
export declare function computeAllCalculations(input: CalculationInput): {
    bmi: number;
    bmiCategory: string;
    idealWeightMin: number;
    idealWeightMax: number;
    dailyWaterRequirement: number;
    recommendedSleep: number;
    caloriesNeeded: number;
    activityLevel: string;
    healthScore: number;
    riskLevel: string;
};
