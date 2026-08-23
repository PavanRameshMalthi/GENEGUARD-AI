import { body } from 'express-validator';
export const createGoalValidator = [
    body('title')
        .notEmpty()
        .withMessage('Goal title is required')
        .isLength({ max: 200 })
        .withMessage('Goal title cannot exceed 200 characters'),
    body('target')
        .isFloat({ min: 0.1 })
        .withMessage('Target value must be a positive number'),
    body('unit')
        .notEmpty()
        .withMessage('Unit of measurement is required')
        .isLength({ max: 50 })
        .withMessage('Unit cannot exceed 50 characters'),
    body('targetDate')
        .notEmpty()
        .withMessage('Target date is required')
        .isISO8601()
        .withMessage('Target date must be a valid date')
];
