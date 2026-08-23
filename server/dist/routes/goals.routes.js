import { Router } from 'express';
import { createGoal, getGoals, getGoalById, updateGoal, deleteGoal } from '../controllers/goals.controller.js';
import { protect } from '../middleware/auth.js';
import { createGoalValidator } from '../validators/goal.validator.js';
import { validate } from '../middleware/validate.js';
const router = Router();
router.route('/')
    .post(protect, createGoalValidator, validate, createGoal)
    .get(protect, getGoals);
router.route('/:id')
    .get(protect, getGoalById)
    .put(protect, updateGoal)
    .delete(protect, deleteGoal);
export default router;
