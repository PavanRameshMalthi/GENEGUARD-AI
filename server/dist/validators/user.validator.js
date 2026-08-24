import { body } from 'express-validator';
export const updateProfileValidator = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s\-'.]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('age')
        .optional({ nullable: true })
        .custom((val) => {
        if (val === undefined || val === null || val === '')
            return true;
        const num = Number(val);
        if (!Number.isInteger(num) || num < 1 || num > 120) {
            throw new Error('Age must be an integer between 1 and 120');
        }
        return true;
    }),
    body('gender')
        .optional({ nullable: true })
        .trim()
        .isIn(['male', 'female', 'other', 'prefer not to say']).withMessage('Invalid gender value'),
    body('height')
        .optional({ nullable: true })
        .isFloat({ min: 50, max: 250 }).withMessage('Height must be between 50 and 250 cm'),
    body('weight')
        .optional({ nullable: true })
        .isFloat({ min: 10, max: 500 }).withMessage('Weight must be between 10 and 500 kg'),
    body('bloodGroup')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
    body('medicalHistory')
        .optional()
        .isArray().withMessage('Medical history must be an array of strings')
];
export const updatePasswordValidator = [
    body('oldPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6, max: 128 }).withMessage('New password must be between 6 and 128 characters')
];
export const updateSettingsValidator = [
    body('theme')
        .optional()
        .isIn(['light', 'dark']).withMessage('Theme must be light or dark'),
    body('notifications')
        .optional()
        .isBoolean().withMessage('Notifications must be a boolean')
];
