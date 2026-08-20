import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from './env.js';
export const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
