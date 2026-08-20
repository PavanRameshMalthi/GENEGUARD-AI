import { generateRecommendations, generateWeeklyGoals } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
export const getDailyRecommendations = async (req, res) => {
    try {
        const recommendations = await generateRecommendations(req.user.profile);
        res.json(formatResponse(true, recommendations));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getWeeklyGoals = async (req, res) => {
    try {
        const goals = await generateWeeklyGoals(req.user.profile);
        res.json(formatResponse(true, goals));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
