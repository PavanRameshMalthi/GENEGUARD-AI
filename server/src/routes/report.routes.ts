import { Router } from 'express';
import { uploadReport, analyzeReportFile, getReports, getReport, generateHealthReport } from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.route('/')
  .get(protect, getReports);

router.post('/upload', protect, upload.single('file'), uploadReport);

router.get('/health-report/:assessmentId', protect, generateHealthReport);

router.route('/:id')
  .get(protect, getReport);

router.post('/:id/analyze', protect, analyzeReportFile);

export default router;