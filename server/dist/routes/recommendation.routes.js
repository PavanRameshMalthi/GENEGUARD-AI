import { Router } from 'express';
import { getDailyRecommendations, getWeeklyGoals } from '../controllers/recommendation.controller.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/daily', protect, getDailyRecommendations);
router.get('/weekly-goals', protect, getWeeklyGoals);
export default router;
