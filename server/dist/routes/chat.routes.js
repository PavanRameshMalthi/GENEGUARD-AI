import { Router } from 'express';
import { sendMessage, getHistory, deleteHistory } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.post('/message', protect, sendMessage);
router.route('/history')
    .get(protect, getHistory)
    .delete(protect, deleteHistory);
export default router;
