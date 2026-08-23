import { Router } from 'express';
import { getAchievements } from '../controllers/achievement.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getAchievements);

export default router;
