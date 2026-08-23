import { Router } from 'express';
import { copilotChat, getCopilotContextSummary } from '../controllers/copilot.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/chat', copilotChat);
router.get('/context', getCopilotContextSummary);

export default router;
