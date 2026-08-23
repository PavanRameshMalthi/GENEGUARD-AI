import { Response } from 'express';
import { computeDynamicHealthScore } from '../services/scoring.service.js';
import { formatResponse } from '../utils/helpers.js';

export const getDynamicHealthScore = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const scoreResult = await computeDynamicHealthScore(userId);
    res.json(formatResponse(true, scoreResult));
  } catch (error: any) {
    console.error('Error fetching dynamic health score:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to compute dynamic health score'));
  }
};
