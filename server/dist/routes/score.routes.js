import { Router } from 'express';
import { getDynamicHealthScore } from '../controllers/score.controller.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/', protect, getDynamicHealthScore);
export default router;
