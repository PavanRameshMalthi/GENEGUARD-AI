import { analyzeHealth, chatResponse } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
export const analyzeHealthData = async (req, res) => {
    try {
        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json(formatResponse(false, null, 'No health data provided'));
        }
        const analysis = await analyzeHealth(data);
        if (!analysis) {
            return res.status(503).json(formatResponse(false, null, 'AI service unavailable. Please check your Gemini API key.'));
        }
        res.json(formatResponse(true, analysis));
    }
    catch (error) {
        if (error.message?.includes('API_KEY')) {
            return res.status(503).json(formatResponse(false, null, 'Invalid Gemini API key. Please check your environment configuration.'));
        }
        if (error.message?.includes('429') || error.message?.includes('RATE_LIMIT')) {
            return res.status(429).json(formatResponse(false, null, 'AI rate limit reached. Please try again later.'));
        }
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const chatWithAI = async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json(formatResponse(false, null, 'Message is required'));
        }
        const responseText = await chatResponse(history, message);
        res.json(formatResponse(true, { response: responseText }));
    }
    catch (error) {
        if (error.message?.includes('API_KEY')) {
            return res.status(503).json(formatResponse(false, null, 'Invalid Gemini API key. Please check your environment configuration.'));
        }
        if (error.message?.includes('429') || error.message?.includes('RATE_LIMIT')) {
            return res.status(429).json(formatResponse(false, null, 'AI rate limit reached. Please try again later.'));
        }
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
