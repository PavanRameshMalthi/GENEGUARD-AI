import { Router } from 'express';
import { getStats, getUsers, getAssessments, getLogs } from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/assessments', getAssessments);
router.get('/logs', getLogs);

export default router;