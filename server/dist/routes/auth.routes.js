import { Router } from 'express';
import { register, login, forgotPassword, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
const router = Router();
router.post('/register', authLimiter, [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.get('/me', protect, getMe);
export default router;
