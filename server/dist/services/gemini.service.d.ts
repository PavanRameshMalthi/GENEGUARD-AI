import { IStructuredReportAnalysis } from '../models/Report.js';
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
export declare const analyzeMedicalReport: (fileName: string, fileType: string, filePath?: string) => Promise<{
    summary: string;
    structuredAnalysis: IStructuredReportAnalysis;
}>;
export declare const analyzeReport: (fileName: string, fileType: string, filePath?: string) => Promise<string>;
export interface CopilotPatientContext {
    profile?: any;
    latestAssessment?: any;
    recentTracking?: any[];
    activeGoals?: any[];
    recentReports?: any[];
    familyHistory?: any[];
}
export declare const generateCopilotResponse: (context: CopilotPatientContext, userMessage: string, chatHistory?: any[]) => Promise<{
    text: string;
    safety: any;
    suggestedActions?: string[];
    category?: string;
}>;
export interface ReportComparisonDelta {
    metric: string;
    previousValue: string;
    currentValue: string;
    changeValue: string;
    status: 'improved' | 'stable' | 'deteriorated' | 'neutral';
    clinicalContext: string;
}
export interface ReportComparisonResult {
    report1: {
        id: string;
        name: string;
        date: string;
    };
    report2: {
        id: string;
        name: string;
        date: string;
    };
    overallComparisonSummary: string;
    deltas: ReportComparisonDelta[];
    improvements: string[];
    concerns: string[];
    questionsForDoctor: string[];
    recommendedActions: string[];
}
export declare const compareMedicalReports: (report1: {
    id: string;
    fileName: string;
    date: string;
    summary?: string;
    structuredAnalysis?: any;
}, report2: {
    id: string;
    fileName: string;
    date: string;
    summary?: string;
    structuredAnalysis?: any;
}) => Promise<ReportComparisonResult>;
export interface FamilyHereditaryRiskReport {
    overallRiskScore: number;
    riskCategory: 'Low' | 'Moderate' | 'High';
    summary: string;
    conditionPredispositions: Array<{
        condition: string;
        riskScore: number;
        riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
        affectedRelatives: string[];
        geneticWeight: string;
        preventiveGuidelines: string[];
        screeningBenchmarks: string;
    }>;
    preventiveActionPlan: string[];
    recommendedGeneticConsultation: boolean;
}
export declare const analyzeFamilyHereditaryRisk: (familyMembers: any[], userProfile: any) => Promise<FamilyHereditaryRiskReport>;
export declare const generateRecommendations: (assessmentData: any) => Promise<any>;
export declare const generateWeeklyGoals: (assessmentData: any) => Promise<any>;
