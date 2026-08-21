export declare const generateSmartClinicalAnalysis: (data: any) => {
    overallHealthSummary: string;
    healthScore: any;
    riskFactors: string[];
    dietPlan: {
        breakfast: string[];
        lunch: string[];
        dinner: string[];
        snacks: string[];
        avoidFoods: string[];
        healthyFoods: string[];
        proteinTips: string;
        fiberTips: string;
        sugarReduction: string;
    };
    exercisePlan: {
        beginner: {
            name: string;
            duration: string;
            caloriesBurned: string;
            frequency: string;
            difficulty: string;
        }[];
        intermediate: {
            name: string;
            duration: string;
            caloriesBurned: string;
            frequency: string;
            difficulty: string;
        }[];
        advanced: {
            name: string;
            duration: string;
            caloriesBurned: string;
            frequency: string;
            difficulty: string;
        }[];
    };
    sleepAnalysis: {
        quality: string;
        idealBedTime: any;
        idealWakeTime: any;
        tips: string[];
    };
    hydrationAnalysis: {
        goal: any;
        current: any;
        remaining: number;
        tips: string[];
    };
    stressManagement: string[];
    lifestyleImprovements: string[];
    weeklyGoals: string[];
    preventiveHealthAdvice: string[];
    medicalCheckupSuggestions: string[];
    whenToVisitDoctor: string;
};
export declare const analyzeHealth: (assessmentData: any) => Promise<any>;
export declare const chatResponse: (messages: any[], userMessage: string) => Promise<string>;
export declare const analyzeReport: (fileName: string, fileType: string) => Promise<string>;
export declare const generateRecommendations: (assessmentData: any) => Promise<any>;
export declare const generateWeeklyGoals: (assessmentData: any) => Promise<any>;
