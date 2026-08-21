import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from './env.js';
let genAIInstance = null;
export const getGeminiClient = () => {
    if (!ENV.GEMINI_API_KEY) {
        return null;
    }
    if (!genAIInstance) {
        genAIInstance = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    }
    return genAIInstance;
};
export const hasGeminiConfigured = () => {
    return Boolean(ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim().length > 0);
};
export const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY || 'default_key_placeholder');
