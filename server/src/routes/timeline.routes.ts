import { Router } from 'express';
import { getTimelineEvents } from '../controllers/timeline.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getTimelineEvents);

export default router;
