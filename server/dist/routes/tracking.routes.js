import { Router } from 'express';
import { upsertDailyTracking, getTrackingHistory, getTodayTracking, getTrackingById, deleteTracking } from '../controllers/tracking.controller.js';
import { protect } from '../middleware/auth.js';
import { createTrackingValidator } from '../validators/tracking.validator.js';
import { validate } from '../middleware/validate.js';
const router = Router();
router.route('/')
    .post(protect, createTrackingValidator, validate, upsertDailyTracking)
    .get(protect, getTrackingHistory);
router.get('/today', protect, getTodayTracking);
router.route('/:id')
    .get(protect, getTrackingById)
    .put(protect, createTrackingValidator, validate, upsertDailyTracking)
    .delete(protect, deleteTracking);
export default router;
