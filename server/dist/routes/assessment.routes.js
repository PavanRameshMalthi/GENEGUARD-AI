import { Router } from 'express';
import { createAssessment, getAssessments, getAssessment, getLatestAssessment } from '../controllers/assessment.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createAssessmentValidator } from '../validators/assessment.validator.js';
const router = Router();
router.route('/')
    .post(protect, createAssessmentValidator, validate, createAssessment)
    .get(protect, getAssessments);
router.get('/latest', protect, getLatestAssessment);
router.route('/:id')
    .get(protect, getAssessment);
export default router;
