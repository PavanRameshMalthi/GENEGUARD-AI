import { generateRecommendations, generateWeeklyGoals } from '../services/gemini.service.js';
import { Assessment } from '../models/Assessment.js';
import { formatResponse } from '../utils/helpers.js';
export const getDailyRecommendations = async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        const recommendations = await generateRecommendations(assessment);
        res.json(formatResponse(true, recommendations));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getWeeklyGoals = async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        const goals = await generateWeeklyGoals(assessment);
        res.json(formatResponse(true, goals));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
