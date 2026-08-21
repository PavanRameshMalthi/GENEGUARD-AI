import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from './env.js';

let genAIInstance: GoogleGenerativeAI | null = null;

export const getGeminiClient = (): GoogleGenerativeAI | null => {
  if (!ENV.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  }
  return genAIInstance;
};

export const hasGeminiConfigured = (): boolean => {
  return Boolean(ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim().length > 0);
};

export const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY || 'default_key_placeholder');