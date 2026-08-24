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
  theme: 'light' | 'dark';
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
  totalTrackingEntries?: number;
  totalGoals?: number;
  totalNotifications?: number;
  totalWeeklyReports?: number;
  recentUsers: User[];
  recentAssessments: Assessment[];
  adminEmail?: string;
  systemStatus?: string;
  timestamp?: string;
}

export type Theme = 'light' | 'dark';

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
  eventType: 'assessment' | 'tracking' | 'score_change' | 'weight_change' | 'bmi_change' | 'exercise' | 'sleep' | 'hydration' | 'goal' | 'report' | 'weekly_report' | 'ai_analysis' | 'general';
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

// ==========================================
// Phase 2 New Types
// ==========================================

// 1. Preventive Health Calendar
export interface PreventiveEvent {
  _id: string;
  userId: string;
  title: string;
  category: 'screening' | 'vaccination' | 'doctor_visit' | 'lab_test' | 'medication_review' | 'lifestyle';
  description?: string;
  date: string;
  time?: string;
  frequency: 'once' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  status: 'scheduled' | 'completed' | 'skipped' | 'overdue';
  doctorName?: string;
  location?: string;
  notes?: string;
  isAiRecommended?: boolean;
  riskFactorTag?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendedScreening {
  title: string;
  category: 'screening' | 'vaccination' | 'doctor_visit' | 'lab_test' | 'medication_review' | 'lifestyle';
  description: string;
  frequency: string;
  recommendedMonthsAhead: number;
  riskFactorTag: string;
  reason: string;
}

// 2. Family Health Factors
export interface FamilyMember {
  _id: string;
  userId: string;
  relation: 'father' | 'mother' | 'paternal_grandfather' | 'paternal_grandmother' | 'maternal_grandfather' | 'maternal_grandmother' | 'brother' | 'sister' | 'son' | 'daughter';
  name?: string;
  age?: number;
  isLiving: boolean;
  conditions: string[];
  ageOfOnset?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HereditaryRiskAnalysis {
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

// 3. Achievements & Streaks
export interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'activity' | 'assessment' | 'goals' | 'hydration' | 'sleep' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  unlockedAt?: string;
  xpValue: number;
  isUnlocked?: boolean;
}

export interface UserStreak {
  current: number;
  longest: number;
  lastDate?: string;
}

export interface UserAchievement {
  _id: string;
  userId: string;
  streaks: {
    dailyTracking: UserStreak;
    hydrationGoal: UserStreak;
    sleepGoal: UserStreak;
    stepsGoal: UserStreak;
  };
  totalXp: number;
  level: number;
  unlockedBadges: Badge[];
}

export interface AchievementResponse {
  achievement: UserAchievement;
  allBadges: Badge[];
  nextLevelXp: number;
  currentLevelProgress: number;
}

// 4. AI Health Copilot
export interface CopilotResponse {
  text: string;
  safety: {
    isEmergency: boolean;
    emergencyType?: string;
    emergencyMessage?: string;
    flaggedKeywords: string[];
    safeAdvice?: string;
  };
  suggestedActions?: string[];
  category?: string;
}

export interface CopilotContextSummary {
  hasAssessment: boolean;
  healthScore: number | null;
  riskLevel: string | null;
  trackingDaysCount: number;
  activeGoalsCount: number;
  reportsCount: number;
  familyMembersCount: number;
}

// 5. Medical Report Comparison
export interface ReportComparisonDelta {
  metric: string;
  previousValue: string;
  currentValue: string;
  changeValue: string;
  status: 'improved' | 'stable' | 'deteriorated' | 'neutral';
  clinicalContext: string;
}

export interface ReportComparisonResult {
  report1: { id: string; name: string; date: string };
  report2: { id: string; name: string; date: string };
  overallComparisonSummary: string;
  deltas: ReportComparisonDelta[];
  improvements: string[];
  concerns: string[];
  questionsForDoctor: string[];
  recommendedActions: string[];
}

// 6. Admin Analytics
export interface AdminAnalyticsData {
  userGrowth: Array<{ date: string; newUsers: number; totalUsers: number }>;
  riskDistribution: Array<{ name: string; count: number; color: string }>;
  riskFactorsBreakdown: Array<{ factor: string; prevalence: number; percentage: number }>;
  reportCategories: Array<{ category: string; count: number }>;
  goalsTelemetry: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
  };
  preventiveEventsCount: number;
  dailyLogsCount: number;
  aiTelemetry: {
    geminiActive: boolean;
    engineModel: string;
    totalAiQueries: number;
    estimatedLatencyMs: number;
    safetyFlaggedIncidents: number;
  };
}
