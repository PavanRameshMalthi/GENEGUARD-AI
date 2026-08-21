/**
 * Validation constants and utility functions for GeneGuard AI
 * Enforces strict limits, sanitization, and real-time validation checks.
 */

export const VALIDATION_LIMITS = {
  age: { min: 1, max: 120, integer: true, unit: 'years' },
  height: { min: 50, max: 250, integer: false, unit: 'cm' },
  weight: { min: 10, max: 500, integer: false, unit: 'kg' },
  dailyWaterIntake: { min: 0.5, max: 10, integer: false, unit: 'Liters' },
  sleepHours: { min: 0, max: 24, integer: false, unit: 'hours' },
  dailyScreenTime: { min: 0, max: 24, integer: false, unit: 'hours' },
  workoutDuration: { min: 0, max: 300, integer: true, unit: 'minutes' },
  dailyWalkingMinutes: { min: 0, max: 600, integer: true, unit: 'minutes' },
  stepsPerDay: { min: 0, max: 100000, integer: true, unit: 'steps' },
  stressLevel: { min: 1, max: 10, integer: true, unit: '/10' },
  mealsPerDay: { min: 1, max: 10, integer: true, unit: 'meals' },
  workingHours: { min: 0, max: 24, integer: false, unit: 'hours' },
  fruitsPerWeek: { min: 0, max: 100, integer: true, unit: 'servings' },
  vegetablesPerWeek: { min: 0, max: 100, integer: true, unit: 'servings' },
  waterIntake: { min: 0, max: 50, integer: false, unit: 'glasses/liters' },
} as const;

/**
 * Sanitization functions
 */
export function sanitizeText(val: string): string {
  if (!val) return '';
  // Trim spaces and remove control characters
  return val.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
}

export function sanitizeNumericString(val: string, allowDecimals = true): string {
  if (!val) return '';
  // Remove spaces, + sign, - sign, e, E, and letters
  let sanitized = val.replace(/[^0-9.]/g, '');
  if (!allowDecimals) {
    sanitized = sanitized.replace(/\./g, '');
  } else {
    // Keep only the first decimal point
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
  }
  return sanitized;
}

export function parseNumberSafely(val: any): number | null {
  if (val === '' || val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

/**
 * Individual field validators
 * Returns null if valid, or a descriptive error message with ❌ prefix if invalid.
 */

export function validateRequired(val: any, fieldLabel: string): string | null {
  if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
    return `❌ ${fieldLabel} is required.`;
  }
  return null;
}

export function validateName(val: string): string | null {
  const sanitized = sanitizeText(val);
  if (!sanitized) return '❌ Name is required.';
  if (sanitized.length < 2) return '❌ Name must be at least 2 characters.';
  if (sanitized.length > 100) return '❌ Name cannot exceed 100 characters.';
  if (!/^[a-zA-Z\s\-'.]+$/.test(sanitized)) {
    return '❌ Name can only contain letters, spaces, hyphens, and apostrophes.';
  }
  return null;
}

export function validateEmail(val: string): string | null {
  const sanitized = sanitizeText(val);
  if (!sanitized) return '❌ Email address is required.';
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(sanitized)) return '❌ Please enter a valid email address.';
  return null;
}

export function validatePassword(val: string): string | null {
  if (!val) return '❌ Password is required.';
  if (val.length < 6) return '❌ Password must be at least 6 characters.';
  if (val.length > 128) return '❌ Password cannot exceed 128 characters.';
  return null;
}

export function validateAge(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Age is required.';
  const strVal = String(val).trim();
  if (strVal.includes('.') || strVal.includes(',')) return '❌ Age must be a whole number (no decimals).';
  const num = Number(strVal);
  if (isNaN(num)) return '❌ Age must be a valid number.';
  if (num < 1) return '❌ Age cannot be 0 or negative (must be at least 1).';
  if (num > 120) return '❌ Age cannot exceed 120 years.';
  if (!Number.isInteger(num)) return '❌ Age must be a whole integer.';
  return null;
}

export function validateHeight(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Height is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Height must be a valid number.';
  if (num <= 0) return '❌ Height cannot be 0 or negative.';
  if (num < 50 || num > 250) return '❌ Height must be between 50 cm and 250 cm.';
  return null;
}

export function validateWeight(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Weight is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Weight must be a valid number.';
  if (num <= 0) return '❌ Weight cannot be 0 or negative.';
  if (num < 10 || num > 500) return '❌ Weight must be between 10 kg and 500 kg.';
  return null;
}

export function validateDailyWaterIntake(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Daily water intake is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Daily water intake must be a valid number.';
  if (num <= 0) return '❌ Water intake cannot be 0 or negative.';
  if (num < 0.5 || num > 10) return '❌ Daily water intake must be between 0.5 and 10 Liters.';
  return null;
}

export function validateSleepHours(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Sleep hours are required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Sleep hours must be a valid number.';
  if (num < 0) return '❌ Sleep hours cannot be negative.';
  if (num > 24) return '❌ Sleep hours cannot exceed 24 hours.';
  return null;
}

export function validateScreenTime(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Screen time is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Screen time must be a valid number.';
  if (num < 0) return '❌ Screen time cannot be negative.';
  if (num > 24) return '❌ Screen time cannot exceed 24 hours.';
  return null;
}

export function validateWorkingHours(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Working hours are required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Working hours must be a valid number.';
  if (num < 0) return '❌ Working hours cannot be negative.';
  if (num > 24) return '❌ Working hours cannot exceed 24 hours.';
  return null;
}

export function validateStressLevel(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Stress level is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Stress level must be a valid number.';
  if (num < 1 || num > 10) return '❌ Stress level must be between 1 and 10.';
  return null;
}

export function validateWalkingMinutes(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Daily walking minutes are required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Walking minutes must be a valid number.';
  if (num < 0) return '❌ Walking minutes cannot be negative.';
  if (num > 600) return '❌ Walking minutes cannot exceed 600 minutes (10 hours).';
  return null;
}

export function validateStepsPerDay(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Steps per day are required.';
  const strVal = String(val).trim();
  if (strVal.includes('.') || strVal.includes(',')) return '❌ Steps per day must be a whole number.';
  const num = Number(strVal);
  if (isNaN(num)) return '❌ Steps per day must be a valid number.';
  if (num < 0) return '❌ Steps per day cannot be negative.';
  if (num > 100000) return '❌ Steps per day cannot exceed 100,000.';
  return null;
}

export function validateWorkoutDuration(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Workout duration is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Workout duration must be a valid number.';
  if (num < 0) return '❌ Workout duration cannot be negative.';
  if (num > 300) return '❌ Workout duration cannot exceed 300 minutes (5 hours).';
  return null;
}

export function validateMealsPerDay(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Meals per day is required.';
  const strVal = String(val).trim();
  if (strVal.includes('.') || strVal.includes(',')) return '❌ Meals per day must be a whole number.';
  const num = Number(strVal);
  if (isNaN(num)) return '❌ Meals per day must be a valid number.';
  if (num < 1) return '❌ Meals per day cannot be 0 or negative (must be at least 1).';
  if (num > 10) return '❌ Meals per day cannot exceed 10.';
  return null;
}

export function validateFruitsPerWeek(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Fruits per week is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Fruits per week must be a valid number.';
  if (num < 0) return '❌ Fruits per week cannot be negative.';
  if (num > 100) return '❌ Fruits per week cannot exceed 100 servings.';
  return null;
}

export function validateVegetablesPerWeek(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Vegetables per week is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Vegetables per week must be a valid number.';
  if (num < 0) return '❌ Vegetables per week cannot be negative.';
  if (num > 100) return '❌ Vegetables per week cannot exceed 100 servings.';
  return null;
}

export function validateWaterIntake(val: any): string | null {
  if (val === '' || val === null || val === undefined) return '❌ Water intake is required.';
  const num = Number(val);
  if (isNaN(num)) return '❌ Water intake must be a valid number.';
  if (num < 0) return '❌ Water intake cannot be negative.';
  if (num > 50) return '❌ Water intake cannot exceed 50.';
  return null;
}

export function validateTimeFormat(val: string, fieldLabel: string): string | null {
  if (!val || val.trim() === '') return `❌ ${fieldLabel} is required.`;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(val.trim())) {
    return `❌ ${fieldLabel} must be a valid time (HH:MM).`;
  }
  return null;
}

export function validateEnum(val: string, allowed: readonly string[], fieldLabel: string): string | null {
  if (!val || val.trim() === '') return `❌ ${fieldLabel} is required.`;
  if (!allowed.includes(val)) {
    return `❌ Invalid selection for ${fieldLabel}.`;
  }
  return null;
}
