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

export interface Assessment {
  _id: string;
  userId: string;
  personalInfo: PersonalInfo;
  lifestyle: Lifestyle;
  medical: MedicalInfo;
  aiAnalysis?: AIAnalysis;
  createdAt: string;
}

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
  exercise: string;
  sleep: number;
  waterIntake: number;
  stress: string;
}

export interface MedicalInfo {
  familyHistory: string[];
  medicalHistory: string[];
  symptoms: string[];
}

export interface AIAnalysis {
  healthScore: number;
  healthSummary: string;
  riskFactors: string[];
  lifestyleImprovements: string[];
  dietSuggestions: string[];
  exerciseSuggestions: string[];
  hydrationAdvice: string;
  mentalWellnessTips: string[];
  preventiveCheckups: string[];
  whenToVisitDoctor: string;
}

export interface ChatMessageType {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Report {
  _id: string;
  userId: string;
  fileName: string;
  fileType: string;
  filePath: string;
  aiSummary?: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  category: 'exercise' | 'diet' | 'water' | 'sleep' | 'mental';
  title: string;
  description: string;
  icon: string;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  target: string;
  progress: number;
  category: string;
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
