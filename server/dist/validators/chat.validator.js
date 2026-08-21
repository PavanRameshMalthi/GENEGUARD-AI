import { body } from 'express-validator';
export const sendMessageValidator = [
    body('message')
        .trim()
        .notEmpty().withMessage('Message cannot be empty')
        .isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters')
];
