import { Router } from 'express';
import {
  uploadReport,
  analyzeReportFile,
  getReports,
  getReport,
  deleteReport,
  downloadReportFile,
  generateHealthReport
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.route('/')
  .get(protect, getReports);

router.post('/upload', protect, upload.single('file'), uploadReport);

router.get('/health-report/:assessmentId', protect, generateHealthReport);

router.route('/:id')
  .get(protect, getReport)
  .delete(protect, deleteReport);

router.post('/:id/analyze', protect, analyzeReportFile);
router.get('/:id/download', protect, downloadReportFile);

export default router;