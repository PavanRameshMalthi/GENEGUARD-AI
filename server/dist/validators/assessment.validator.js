import { body } from 'express-validator';
export const createAssessmentValidator = [
    // Personal Info
    body('personalInfo').isObject().withMessage('Personal information is required'),
    body('personalInfo.name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s\-'.]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('personalInfo.age')
        .notEmpty().withMessage('Age is required')
        .custom((val) => {
        const num = Number(val);
        if (isNaN(num))
            throw new Error('Age must be a valid number');
        if (typeof val === 'string' && (val.includes('.') || val.includes(','))) {
            throw new Error('Age must be a whole integer (no decimals)');
        }
        if (!Number.isInteger(num))
            throw new Error('Age must be a whole integer');
        if (num < 1 || num > 120)
            throw new Error('Age must be between 1 and 120 years');
        return true;
    }),
    body('personalInfo.gender')
        .trim()
        .notEmpty().withMessage('Gender is required')
        .isIn(['male', 'female', 'other', 'prefer not to say']).withMessage('Gender must be one of: male, female, other, prefer not to say'),
    body('personalInfo.height')
        .notEmpty().withMessage('Height is required')
        .isFloat({ min: 50, max: 250 }).withMessage('Height must be between 50 cm and 250 cm'),
    body('personalInfo.weight')
        .notEmpty().withMessage('Weight is required')
        .isFloat({ min: 10, max: 500 }).withMessage('Weight must be between 10 kg and 500 kg'),
    body('personalInfo.bloodGroup')
        .trim()
        .notEmpty().withMessage('Blood group is required')
        .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group specified'),
    // Lifestyle
    body('lifestyle').isObject().withMessage('Lifestyle details are required'),
    body('lifestyle.smoking')
        .trim()
        .isIn(['yes', 'no']).withMessage('Smoking must be yes or no'),
    body('lifestyle.alcohol')
        .trim()
        .isIn(['never', 'occasionally', 'frequently']).withMessage('Alcohol frequency must be: never, occasionally, or frequently'),
    body('lifestyle.dailyWaterIntake')
        .notEmpty().withMessage('Daily water intake is required')
        .isFloat({ min: 0.5, max: 10 }).withMessage('Daily water intake must be between 0.5 and 10 Liters'),
    body('lifestyle.sleepHours')
        .notEmpty().withMessage('Sleep hours are required')
        .isFloat({ min: 0, max: 24 }).withMessage('Sleep hours must be between 0 and 24 hours'),
    body('lifestyle.wakeUpTime')
        .trim()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Wake up time must be in HH:MM 24-hour format'),
    body('lifestyle.bedTime')
        .trim()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Bed time must be in HH:MM 24-hour format'),
    body('lifestyle.dailyScreenTime')
        .notEmpty().withMessage('Daily screen time is required')
        .isFloat({ min: 0, max: 24 }).withMessage('Daily screen time must be between 0 and 24 hours'),
    body('lifestyle.stressLevel')
        .notEmpty().withMessage('Stress level is required')
        .custom((val) => {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 1 || num > 10) {
            throw new Error('Stress level must be a whole number between 1 and 10');
        }
        return true;
    }),
    body('lifestyle.occupation')
        .trim()
        .notEmpty().withMessage('Occupation is required')
        .isLength({ max: 100 }).withMessage('Occupation cannot exceed 100 characters'),
    body('lifestyle.workingHours')
        .notEmpty().withMessage('Working hours are required')
        .isFloat({ min: 0, max: 24 }).withMessage('Working hours must be between 0 and 24 hours'),
    // Physical Activity
    body('physicalActivity').isObject().withMessage('Physical activity details are required'),
    body('physicalActivity.dailyWalkingMinutes')
        .notEmpty().withMessage('Daily walking minutes are required')
        .isFloat({ min: 0, max: 600 }).withMessage('Daily walking minutes must be between 0 and 600 minutes'),
    body('physicalActivity.stepsPerDay')
        .notEmpty().withMessage('Steps per day are required')
        .custom((val) => {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 0 || num > 100000) {
            throw new Error('Steps per day must be a whole number between 0 and 100,000');
        }
        return true;
    }),
    body('physicalActivity.exerciseFrequency')
        .trim()
        .isIn(['never', '1-2 times/week', '3-4 times/week', '5-6 times/week', 'daily'])
        .withMessage('Invalid exercise frequency'),
    body('physicalActivity.exerciseType')
        .trim()
        .notEmpty().withMessage('Exercise type is required')
        .isLength({ max: 100 }).withMessage('Exercise type cannot exceed 100 characters'),
    body('physicalActivity.workoutDuration')
        .notEmpty().withMessage('Workout duration is required')
        .isFloat({ min: 0, max: 300 }).withMessage('Workout duration must be between 0 and 300 minutes'),
    // Nutrition
    body('nutrition').isObject().withMessage('Nutrition details are required'),
    body('nutrition.mealsPerDay')
        .notEmpty().withMessage('Meals per day is required')
        .custom((val) => {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 1 || num > 10) {
            throw new Error('Meals per day must be a whole number between 1 and 10');
        }
        return true;
    }),
    body('nutrition.fruitsPerWeek')
        .notEmpty().withMessage('Fruits per week is required')
        .custom((val) => {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 0 || num > 100) {
            throw new Error('Fruits per week must be an integer between 0 and 100');
        }
        return true;
    }),
    body('nutrition.vegetablesPerWeek')
        .notEmpty().withMessage('Vegetables per week is required')
        .custom((val) => {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 0 || num > 100) {
            throw new Error('Vegetables per week must be an integer between 0 and 100');
        }
        return true;
    }),
    body('nutrition.fastFoodFrequency')
        .trim()
        .isIn(['never', 'once a week', '2-3 times/week', 'daily']).withMessage('Invalid fast food frequency'),
    body('nutrition.sugarIntake')
        .trim()
        .isIn(['low', 'moderate', 'high']).withMessage('Sugar intake must be low, moderate, or high'),
    body('nutrition.waterIntake')
        .notEmpty().withMessage('Water intake is required')
        .isFloat({ min: 0, max: 50 }).withMessage('Water intake must be between 0 and 50'),
    // Medical History (Optional fields, sanitize if present)
    body('medicalHistory.allergies')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 }).withMessage('Allergies description cannot exceed 200 characters'),
    // Symptoms (Optional array)
    body('symptoms')
        .optional()
        .isArray().withMessage('Symptoms must be an array')
];
