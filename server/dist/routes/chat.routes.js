import { Router } from 'express';
import { sendMessage, getHistory, deleteHistory } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { sendMessageValidator } from '../validators/chat.validator.js';
const router = Router();
router.post('/message', protect, sendMessageValidator, validate, sendMessage);
router.route('/history')
    .get(protect, getHistory)
    .delete(protect, deleteHistory);
export default router;
