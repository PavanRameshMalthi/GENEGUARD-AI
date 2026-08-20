import { Response } from 'express';
import { generateRecommendations, generateWeeklyGoals } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';

export const getDailyRecommendations = async (req: any, res: Response) => {
  try {
    const recommendations = await generateRecommendations(req.user.profile);
    res.json(formatResponse(true, recommendations));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getWeeklyGoals = async (req: any, res: Response) => {
  try {
    const goals = await generateWeeklyGoals(req.user.profile);
    res.json(formatResponse(true, goals));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};