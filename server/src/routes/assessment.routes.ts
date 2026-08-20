import { Router } from 'express';
import { createAssessment, getAssessments, getAssessment } from '../controllers/assessment.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.route('/')
  .post(protect, createAssessment)
  .get(protect, getAssessments);

router.route('/:id')
  .get(protect, getAssessment);

export default router;