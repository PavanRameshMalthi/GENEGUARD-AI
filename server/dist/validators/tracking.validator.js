import { body } from 'express-validator';
export const createTrackingValidator = [
    body('date')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Date must be in YYYY-MM-DD format'),
    body('hydration.waterConsumed')
        .optional()
        .isFloat({ min: 0, max: 20 })
        .withMessage('Water consumed must be between 0 and 20 L'),
    body('hydration.waterGoal')
        .optional()
        .isFloat({ min: 0.5, max: 20 })
        .withMessage('Water goal must be between 0.5 and 20 L'),
    body('sleep.totalSleep')
        .optional()
        .isFloat({ min: 0, max: 24 })
        .withMessage('Sleep hours must be between 0 and 24'),
    body('physicalActivity.steps')
        .optional()
        .isInt({ min: 0, max: 100000 })
        .withMessage('Steps must be between 0 and 100,000'),
    body('wellness.stressLevel')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Stress level must be between 1 and 10')
];
