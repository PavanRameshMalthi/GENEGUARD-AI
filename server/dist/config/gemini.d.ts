import { GoogleGenerativeAI } from '@google/generative-ai';
export declare const getGeminiClient: () => GoogleGenerativeAI | null;
export declare const hasGeminiConfigured: () => boolean;
export declare const genAI: GoogleGenerativeAI;
