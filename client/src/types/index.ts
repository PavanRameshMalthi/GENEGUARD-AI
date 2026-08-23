export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profile: UserProfile;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  bloodGroup?: string;
  medicalHistory?: string[];
  familyHistory?: string[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
}

export interface ChatMessageType {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StructuredReportAnalysis {
  summary: string;
  importantFindings: string[];
  abnormalValues: string[];
  normalValues: string[];
  possibleConcerns: string[];
  questionsForDoctor: string[];
  recommendedFollowUp: string[];
  importantDates: string[];
}

export interface Report {
  _id: string;
  userId: string;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize?: number;
  reportType?: string;
  status?: 'pending' | 'analyzed' | 'failed';
  aiSummary?: string;
  structuredAnalysis?: StructuredReportAnalysis;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AdminStats {
  totalUsers: number;
  totalAssessments: number;
  totalReports: number;
  totalChats: number;
  recentUsers: User[];
  recentAssessments: Assessment[];
}

export type Theme = 'light' | 'dark' | 'system';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export interface Recommendation {
  category: 'diet' | 'exercise' | 'general' | string;
  title: string;
  description: string;
}

// Assessment-related types
export interface PersonalInfo {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bloodGroup: string;
}

export interface Lifestyle {
  smoking: string;
  alcohol: string;
  dailyWaterIntake: number;
  sleepHours: number;
  wakeUpTime: string;
  bedTime: string;
  dailyScreenTime: number;
  stressLevel: number;
  occupation: string;
  workingHours: number;
}

export interface PhysicalActivity {
  dailyWalkingMinutes: number;
  stepsPerDay: number;
  exerciseFrequency: string;
  exerciseType: string;
  workoutDuration: number;
}

export interface Nutrition {
  mealsPerDay: number;
  fruitsPerWeek: number;
  vegetablesPerWeek: number;
  fastFoodFrequency: string;
  sugarIntake: string;
  waterIntake: number;
}

export interface MedicalHistory {
  diabetes: boolean;
  bloodPressure: boolean;
  heartDisease: boolean;
  asthma: boolean;
  thyroid: boolean;
  cholesterol: boolean;
  allergies: string;
}

export interface FamilyHistory {
  diabetes: boolean;
  heartDisease: boolean;
  cancer: boolean;
  hypertension: boolean;
  kidneyDisease: boolean;
}

export interface Calculations {
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
}

export interface ExerciseItem {
  name: string;
  duration: string;
  caloriesBurned: string;
  frequency: string;
  difficulty: string;
}

export interface DietPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
  avoidFoods: string[];
  healthyFoods: string[];
  proteinTips: string;
  fiberTips: string;
  sugarReduction: string;
}

export interface ExercisePlan {
  beginner: ExerciseItem[];
  intermediate: ExerciseItem[];
  advanced: ExerciseItem[];
}

export interface SleepAnalysis {
  quality: string;
  idealBedTime: string;
  idealWakeTime: string;
  tips: string[];
}

export interface HydrationAnalysis {
  goal: number;
  current: number;
  remaining: number;
  tips: string[];
}

export interface AIAnalysis {
  overallHealthSummary: string;
  healthScore: number;
  riskFactors: string[];
  dietPlan: DietPlan;
  exercisePlan: ExercisePlan;
  sleepAnalysis: SleepAnalysis;
  hydrationAnalysis: HydrationAnalysis;
  stressManagement: string[];
  lifestyleImprovements: string[];
  weeklyGoals: string[];
  preventiveHealthAdvice: string[];
  medicalCheckupSuggestions: string[];
  whenToVisitDoctor: string;
}

export interface Assessment {
  _id: string;
  userId: string;
  personalInfo: PersonalInfo;
  lifestyle: Lifestyle;
  physicalActivity: PhysicalActivity;
  nutrition: Nutrition;
  medicalHistory: MedicalHistory;
  familyHistory: FamilyHistory;
  symptoms: string[];
  calculations: Calculations;
  aiAnalysis?: AIAnalysis;
  createdAt: string;
}

// Daily Tracking Types
export interface DailyTracking {
  _id?: string;
  userId?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

// Health Goals Types
export interface HealthGoal {
  _id: string;
  userId: string;
  title: string;
  category: 'hydration' | 'sleep' | 'activity' | 'nutrition' | 'weight' | 'general';
  target: number;
  current: number;
  unit: string;
  startDate: string;
  targetDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  createdAt?: string;
  updatedAt?: string;
}

// Health Timeline Types
export interface TimelineEvent {
  _id: string;
  userId: string;
  eventType: 'assessment' | 'tracking' | 'score_change' | 'weight_change' | 'bmi_change' | 'exercise' | 'sleep' | 'hydration' | 'goal' | 'report' | 'weekly_report' | 'ai_analysis';
  title: string;
  description: string;
  category: 'assessments' | 'exercise' | 'sleep' | 'hydration' | 'reports' | 'goals' | 'general';
  data?: any;
  eventDate: string;
  createdAt?: string;
}

// Notifications
export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'tracking' | 'goal' | 'report' | 'weekly' | 'system' | 'reminder';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// Weekly Health Report Types
export interface WeeklyHealthReport {
  _id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  dateRangeFormatted: string;
  healthScore: number;
  scoreChange: number;
  averageSleep: number;
  averageHydration: number;
  averageSteps: number;
  totalExerciseMinutes: number;
  stressAverage: number;
  goalCompletion: {
    total: number;
    completed: number;
    percentage: number;
  };
  weightChange: number;
  bmi: number;
  achievements: string[];
  areasToImprove: string[];
  nextWeekGoals: string[];
  aiRecommendations: string[];
  dataPointsCount: number;
  createdAt: string;
}

// Dynamic Health Score Result
export interface DynamicScoreResult {
  hasData: boolean;
  overallScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  previousScore?: number;
  scoreChange?: number;
  changeExplanation: string;
  subScores: {
    sleepScore: number;
    hydrationScore: number;
    activityScore: number;
    nutritionScore: number;
    lifestyleScore: number;
  };
  metrics: {
    avgSleep: number;
    avgWater: number;
    avgSteps: number;
    bmi: number;
    stressAverage: number;
    goalsCompleted: number;
    totalGoals: number;
  };
}
