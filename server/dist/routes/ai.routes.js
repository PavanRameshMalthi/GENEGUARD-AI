import { Router } from 'express';
import { analyzeHealthData, chatWithAI } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.post('/analyze', protect, analyzeHealthData);
router.post('/chat', protect, chatWithAI);
export default router;
