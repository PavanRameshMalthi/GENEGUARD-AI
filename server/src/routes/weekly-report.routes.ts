import { Router } from 'express';
import {
  getWeeklyReports,
  getLatestWeeklyReport,
  getWeeklyReportById,
  generateWeeklyReport
} from '../controllers/weekly-report.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getWeeklyReports);
router.get('/latest', protect, getLatestWeeklyReport);
router.post('/generate', protect, generateWeeklyReport);
router.get('/:id', protect, getWeeklyReportById);

export default router;
