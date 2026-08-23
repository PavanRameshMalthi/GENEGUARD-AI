import { Router } from 'express';
import { getStats, getUsers, getAssessments, getLogs, deleteUser } from '../controllers/admin.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
const router = Router();
// Protect ALL admin routes with both JWT authentication AND database-level requireAdmin authorization
router.use(authenticateUser, requireAdmin);
router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/assessments', getAssessments);
router.get('/logs', getLogs);
export default router;
