import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Activity,
  Moon,
  Droplet,
  Apple,
  Heart,
  Sparkles,
  Calendar,
  AlertCircle,
  Plus,
  RotateCcw
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { DailyTracking } from '@/types';
import { trackingService } from '@/services/tracking.service';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

interface DailyTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: DailyTracking | null;
  targetDate?: string;
}

const STEPS = [
  { id: 1, label: 'Daily Overview', shortLabel: 'Overview', icon: Sparkles },
  { id: 2, label: 'Sleep & Recovery', shortLabel: 'Sleep', icon: Moon },
  { id: 3, label: 'Activity', shortLabel: 'Activity', icon: Activity },
  { id: 4, label: 'Hydration', shortLabel: 'Hydration', icon: Droplet },
  { id: 5, label: 'Nutrition', shortLabel: 'Nutrition', icon: Apple },
  { id: 6, label: 'Wellness', shortLabel: 'Wellness', icon: Heart }
];

const DailyTrackingModal: React.FC<DailyTrackingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  targetDate
}) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const titleId = useId();

  const today = new Date().toISOString().split('T')[0];
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState(targetDate || today);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 1. Daily Overview State
  const [weight, setWeight] = useState<string>('');
  const [restingHeartRate, setRestingHeartRate] = useState<string>('');
  const [energyLevel, setEnergyLevel] = useState<string>('');
  const [overallFeeling, setOverallFeeling] = useState<string>('');

  // 2. Sleep State
  const [totalSleep, setTotalSleep] = useState<string>('');
  const [sleepQuality, setSleepQuality] = useState<string>('');
  const [bedtime, setBedtime] = useState<string>('');
  const [wakeUpTime, setWakeUpTime] = useState<string>('');
  const [wokeUpDuringNight, setWokeUpDuringNight] = useState<string>('');
  const [sleepGoal, setSleepGoal] = useState<string>('8.0');

  // 3. Activity State
  const [steps, setSteps] = useState<string>('');
  const [walkingMinutes, setWalkingMinutes] = useState<string>('');
  const [exerciseIntensity, setExerciseIntensity] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('Walking');
  const [exerciseDuration, setExerciseDuration] = useState<string>('');

  // 4. Hydration State
  const [waterConsumed, setWaterConsumed] = useState<string>('');
  const [waterGoal, setWaterGoal] = useState<string>('2.5');

  // 5. Nutrition State
  const [mealsCount, setMealsCount] = useState<string>('');
  const [fruitsServings, setFruitsServings] = useState<string>('');
  const [vegetablesServings, setVegetablesServings] = useState<string>('');
  const [fastFood, setFastFood] = useState<string>('None');
  const [sugarIntake, setSugarIntake] = useState<string>('moderate');
  const [proteinIntake, setProteinIntake] = useState<string>('');

  // 6. Wellness State
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [stressInteracted, setStressInteracted] = useState<boolean>(false);
  const [mood, setMood] = useState<string>('');
  const [screenTime, setScreenTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const isEditing = Boolean(initialData && initialData._id);

  // Initialize or reset form data
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSaveError(null);
      setFieldErrors({});
      return;
    }

    if (initialData) {
      setDate(initialData.date || targetDate || today);

      // Step 1
      setWeight(
        initialData.wellness?.weight !== undefined && initialData.wellness?.weight !== null
          ? String(initialData.wellness.weight)
          : user?.profile?.weight
          ? String(user.profile.weight)
          : ''
      );
      setRestingHeartRate(
        initialData.wellness?.restingHeartRate !== undefined && initialData.wellness?.restingHeartRate !== null
          ? String(initialData.wellness.restingHeartRate)
          : ''
      );
      setEnergyLevel(
        initialData.wellness?.energyLevel !== undefined && initialData.wellness?.energyLevel !== null
          ? mapEnergyLevelToString(initialData.wellness.energyLevel)
          : ''
      );
      setOverallFeeling(initialData.wellness?.overallFeeling || '');

      // Step 2
      setTotalSleep(
        initialData.sleep?.totalSleep !== undefined && initialData.sleep?.totalSleep !== null
          ? String(initialData.sleep.totalSleep)
          : ''
      );
      setSleepQuality(initialData.sleep?.quality || '');
      setBedtime(initialData.sleep?.bedtime || '');
      setWakeUpTime(initialData.sleep?.wakeUpTime || '');
      setWokeUpDuringNight(
        initialData.sleep?.wokeUpDuringNight !== undefined
          ? initialData.sleep.wokeUpDuringNight
            ? 'Yes'
            : 'No'
          : ''
      );
      setSleepGoal(
        initialData.sleep?.sleepGoal !== undefined && initialData.sleep?.sleepGoal !== null
          ? String(initialData.sleep.sleepGoal)
          : '8.0'
      );

      // Step 3
      setSteps(
        initialData.physicalActivity?.steps !== undefined && initialData.physicalActivity?.steps !== null
          ? String(initialData.physicalActivity.steps)
          : ''
      );
      setWalkingMinutes(
        initialData.physicalActivity?.walkingMinutes !== undefined &&
        initialData.physicalActivity?.walkingMinutes !== null
          ? String(initialData.physicalActivity.walkingMinutes)
          : ''
      );
      setExerciseIntensity(initialData.physicalActivity?.exerciseIntensity || '');
      setExerciseType(initialData.physicalActivity?.exerciseType || 'Walking');
      setExerciseDuration(
        initialData.physicalActivity?.exerciseDuration !== undefined &&
        initialData.physicalActivity?.exerciseDuration !== null
          ? String(initialData.physicalActivity.exerciseDuration)
          : ''
      );

      // Step 4
      setWaterConsumed(
        initialData.hydration?.waterConsumed !== undefined && initialData.hydration?.waterConsumed !== null
          ? String(initialData.hydration.waterConsumed)
          : ''
      );
      setWaterGoal(
        initialData.hydration?.waterGoal !== undefined && initialData.hydration?.waterGoal !== null
          ? String(initialData.hydration.waterGoal)
          : '2.5'
      );

      // Step 5
      setMealsCount(
        initialData.nutrition?.mealsCount !== undefined && initialData.nutrition?.mealsCount !== null
          ? String(initialData.nutrition.mealsCount)
          : ''
      );
      setFruitsServings(
        initialData.nutrition?.fruitsServings !== undefined && initialData.nutrition?.fruitsServings !== null
          ? String(initialData.nutrition.fruitsServings)
          : ''
      );
      setVegetablesServings(
        initialData.nutrition?.vegetablesServings !== undefined && initialData.nutrition?.vegetablesServings !== null
          ? String(initialData.nutrition.vegetablesServings)
          : ''
      );
      setFastFood(
        typeof initialData.nutrition?.fastFood === 'string'
          ? initialData.nutrition.fastFood
          : initialData.nutrition?.fastFood
          ? 'Once'
          : 'None'
      );
      setSugarIntake(initialData.nutrition?.sugarIntake || 'moderate');
      setProteinIntake(
        initialData.nutrition?.proteinIntake !== undefined && initialData.nutrition?.proteinIntake !== null
          ? String(initialData.nutrition.proteinIntake)
          : ''
      );

      // Step 6
      setStressLevel(initialData.wellness?.stressLevel ?? 5);
      setStressInteracted(initialData.wellness?.stressLevel !== undefined);
      setMood(initialData.wellness?.mood || '');
      setScreenTime(
        initialData.wellness?.screenTime !== undefined && initialData.wellness?.screenTime !== null
          ? String(initialData.wellness.screenTime)
          : ''
      );
      setNotes(initialData.wellness?.notes || '');
    } else {
      // Empty fresh state — NO FAKE DEFAULT DATA
      setDate(targetDate || today);
      setWeight(user?.profile?.weight ? String(user.profile.weight) : '');
      setRestingHeartRate('');
      setEnergyLevel('');
      setOverallFeeling('');

      setTotalSleep('');
      setSleepQuality('');
      setBedtime('');
      setWakeUpTime('');
      setWokeUpDuringNight('');
      setSleepGoal('8.0');

      setSteps('');
      setWalkingMinutes('');
      setExerciseIntensity('');
      setExerciseType('Walking');
      setExerciseDuration('');

      setWaterConsumed('');
      setWaterGoal('2.5');

      setMealsCount('');
      setFruitsServings('');
      setVegetablesServings('');
      setFastFood('None');
      setSugarIntake('moderate');
      setProteinIntake('');

      setStressLevel(5);
      setStressInteracted(false);
      setMood('');
      setScreenTime('');
      setNotes('');
    }
  }, [isOpen, initialData, targetDate, today, user]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Helpers for mapping energy levels
  function mapEnergyLevelToString(val: number): string {
    if (val <= 2) return 'Very Low';
    if (val <= 4) return 'Low';
    if (val <= 6) return 'Moderate';
    if (val <= 8) return 'High';
    return 'Very High';
  }

  function mapEnergyLevelToNumber(val: string): number {
    switch (val) {
      case 'Very Low':
        return 2;
      case 'Low':
        return 4;
      case 'Moderate':
        return 6;
      case 'High':
        return 8;
      case 'Very High':
        return 10;
      default:
        return 7;
    }
  }

  // Sanitization for non-negative inputs
  const sanitizeNumber = (val: string, allowDecimal = true) => {
    if (val === '') return '';
    if (allowDecimal) {
      const num = parseFloat(val);
      return isNaN(num) ? '' : String(Math.max(0, num));
    }
    const num = parseInt(val, 10);
    return isNaN(num) ? '' : String(Math.max(0, num));
  };

  // Validation rules for current step
  const validateStep = (stepNum: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNum === 1) {
      if (weight && (parseFloat(weight) < 0 || parseFloat(weight) > 500)) {
        errors.weight = 'Weight must be between 0 and 500 kg';
      }
      if (restingHeartRate && (parseInt(restingHeartRate, 10) < 30 || parseInt(restingHeartRate, 10) > 250)) {
        errors.restingHeartRate = 'Heart rate must be between 30 and 250 bpm';
      }
    } else if (stepNum === 2) {
      if (totalSleep && (parseFloat(totalSleep) < 0 || parseFloat(totalSleep) > 24)) {
        errors.totalSleep = 'Sleep hours must be between 0 and 24 hours';
      }
      if (sleepGoal && (parseFloat(sleepGoal) < 4 || parseFloat(sleepGoal) > 14)) {
        errors.sleepGoal = 'Sleep goal must be between 4 and 14 hours';
      }
    } else if (stepNum === 3) {
      if (steps && (parseInt(steps, 10) < 0 || parseInt(steps, 10) > 100000)) {
        errors.steps = 'Steps must be between 0 and 100,000';
      }
      if (walkingMinutes && (parseInt(walkingMinutes, 10) < 0 || parseInt(walkingMinutes, 10) > 1440)) {
        errors.walkingMinutes = 'Walking duration must be between 0 and 1440 minutes';
      }
      if (exerciseDuration && (parseInt(exerciseDuration, 10) < 0 || parseInt(exerciseDuration, 10) > 1440)) {
        errors.exerciseDuration = 'Workout duration must be between 0 and 1440 minutes';
      }
    } else if (stepNum === 4) {
      if (waterConsumed && (parseFloat(waterConsumed) < 0 || parseFloat(waterConsumed) > 20)) {
        errors.waterConsumed = 'Water intake must be between 0 and 20 L';
      }
      if (waterGoal && (parseFloat(waterGoal) < 0.5 || parseFloat(waterGoal) > 20)) {
        errors.waterGoal = 'Daily goal must be between 0.5 and 20 L';
      }
    } else if (stepNum === 5) {
      if (mealsCount && (parseInt(mealsCount, 10) < 0 || parseInt(mealsCount, 10) > 10)) {
        errors.mealsCount = 'Meals count must be between 0 and 10';
      }
      if (fruitsServings && (parseInt(fruitsServings, 10) < 0 || parseInt(fruitsServings, 10) > 30)) {
        errors.fruitsServings = 'Fruits servings must be between 0 and 30';
      }
      if (vegetablesServings && (parseInt(vegetablesServings, 10) < 0 || parseInt(vegetablesServings, 10) > 30)) {
        errors.vegetablesServings = 'Vegetable servings must be between 0 and 30';
      }
      if (proteinIntake && (parseInt(proteinIntake, 10) < 0 || parseInt(proteinIntake, 10) > 500)) {
        errors.proteinIntake = 'Protein intake must be between 0 and 500 g';
      }
    } else if (stepNum === 6) {
      if (screenTime && (parseFloat(screenTime) < 0 || parseFloat(screenTime) > 24)) {
        errors.screenTime = 'Screen time must be between 0 and 24 hours';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSaveError(null);
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrev = () => {
    setSaveError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleTabClick = (stepId: number) => {
    if (validateStep(currentStep)) {
      setSaveError(null);
      setCurrentStep(stepId);
    }
  };

  // Submit form data
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validate current step
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setSaveError(null);

    try {
      const parsedWaterConsumed = waterConsumed !== '' ? parseFloat(waterConsumed) : 0;
      const parsedWaterGoal = waterGoal !== '' ? parseFloat(waterGoal) : 2.5;
      const parsedTotalSleep = totalSleep !== '' ? parseFloat(totalSleep) : 0;
      const parsedSleepGoal = sleepGoal !== '' ? parseFloat(sleepGoal) : 8.0;
      const parsedSteps = steps !== '' ? parseInt(steps, 10) : 0;
      const parsedWalkingMinutes = walkingMinutes !== '' ? parseInt(walkingMinutes, 10) : 0;
      const parsedExerciseDuration = exerciseDuration !== '' ? parseInt(exerciseDuration, 10) : 0;
      const parsedMealsCount = mealsCount !== '' ? parseInt(mealsCount, 10) : 3;
      const parsedFruits = fruitsServings !== '' ? parseInt(fruitsServings, 10) : 0;
      const parsedVegetables = vegetablesServings !== '' ? parseInt(vegetablesServings, 10) : 0;

      const payload: Partial<DailyTracking> = {
        date,
        hydration: {
          waterConsumed: parsedWaterConsumed,
          waterGoal: parsedWaterGoal,
          remainingWater: Math.max(0, Number((parsedWaterGoal - parsedWaterConsumed).toFixed(1)))
        },
        sleep: {
          bedtime: bedtime || '23:00',
          wakeUpTime: wakeUpTime || '07:00',
          totalSleep: parsedTotalSleep,
          sleepGoal: parsedSleepGoal,
          quality: sleepQuality || undefined,
          wokeUpDuringNight: wokeUpDuringNight === 'Yes' ? true : wokeUpDuringNight === 'No' ? false : undefined
        },
        physicalActivity: {
          steps: parsedSteps,
          walkingMinutes: parsedWalkingMinutes,
          exerciseType: exerciseType || 'Walking',
          exerciseDuration: parsedExerciseDuration,
          exerciseIntensity: exerciseIntensity || undefined
        },
        nutrition: {
          mealsCount: parsedMealsCount,
          fruitsServings: parsedFruits,
          vegetablesServings: parsedVegetables,
          fastFood: fastFood === 'Once' || fastFood === 'Multiple times' || fastFood === 'true',
          sugarIntake: (sugarIntake as any) || 'moderate',
          proteinIntake: proteinIntake !== '' ? parseInt(proteinIntake, 10) : undefined
        },
        wellness: {
          stressLevel: stressInteracted ? stressLevel : 5,
          mood: (mood as any) || 'good',
          energyLevel: energyLevel ? mapEnergyLevelToNumber(energyLevel) : 7,
          notes: notes || '',
          weight: weight !== '' ? parseFloat(weight) : undefined,
          restingHeartRate: restingHeartRate !== '' ? parseInt(restingHeartRate, 10) : undefined,
          screenTime: screenTime !== '' ? parseFloat(screenTime) : undefined,
          overallFeeling: overallFeeling || undefined
        }
      };

      await trackingService.saveTracking(payload);
      success("Today's health data saved successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving tracking data:', err);
      const msg = err.response?.data?.message || 'Unable to save your health data. Please try again.';
      setSaveError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const nextStepName = currentStep < 6 ? STEPS[currentStep].label : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 dark:bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="w-full max-w-[800px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-40px)] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto transition-colors duration-200"
            >
              {/* 1. FIXED MODAL HEADER */}
              <div className="px-5 sm:px-7 pt-4 sm:pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/80 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2
                      id={titleId}
                      className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug"
                    >
                      Log Today's Health
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Track your health information for today.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Date display badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <Calendar size={12} className="text-indigo-500" />
                      <span>{date}</span>
                    </div>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close modal"
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* 2. HORIZONTAL STEP NAVIGATION (Reference Image Style) */}
                <div className="mt-3.5 pt-1 -mb-1 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar" role="tablist">
                  {STEPS.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleTabClick(step.id)}
                        className={`relative px-2.5 sm:px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors rounded-lg flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/70 dark:bg-indigo-950/40'
                            : isCompleted
                            ? 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isCompleted ? <Check size={10} strokeWidth={3} /> : step.id}
                        </span>
                        <span className="hidden sm:inline">{step.label}</span>
                        <span className="sm:hidden">{step.shortLabel}</span>

                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Indicator Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
                <div
                  className="bg-indigo-600 h-1 transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>

              {/* 3. SCROLLABLE FORM CONTENT */}
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 max-h-[min(540px,calc(100vh-220px))]">
                {/* Global Save Error Banner */}
                {saveError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle size={16} className="shrink-0 text-rose-500" />
                    <span>{saveError}</span>
                  </div>
                )}

                {/* Inner Clean Content Card (Reference Image Style) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/80">
                  {/* STEP 1: DAILY OVERVIEW */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Overview</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Core health metrics and overall vitals for today.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">Step 1 of 6</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Tracking Date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          max={today}
                          required
                        />

                        <div>
                          <Input
                            label="Weight (kg)"
                            type="number"
                            step="0.1"
                            min="0"
                            max="500"
                            placeholder="e.g. 70.5"
                            value={weight}
                            onChange={(e) => {
                              setWeight(sanitizeNumber(e.target.value));
                              if (fieldErrors.weight) setFieldErrors((prev) => ({ ...prev, weight: '' }));
                            }}
                            error={fieldErrors.weight}
                            helperText={!fieldErrors.weight ? 'Enter your body weight in kilograms' : undefined}
                          />
                        </div>

                        <div>
                          <Input
                            label="Resting Heart Rate (bpm)"
                            type="number"
                            min="0"
                            max="250"
                            placeholder="e.g. 68"
                            value={restingHeartRate}
                            onChange={(e) => {
                              setRestingHeartRate(sanitizeNumber(e.target.value, false));
                              if (fieldErrors.restingHeartRate)
                                setFieldErrors((prev) => ({ ...prev, restingHeartRate: '' }));
                            }}
                            error={fieldErrors.restingHeartRate}
                            helperText={!fieldErrors.restingHeartRate ? 'Measured in beats per minute' : undefined}
                          />
                        </div>

                        {/* Overall Feeling Pills */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Overall Feeling
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {['Poor', 'Okay', 'Good', 'Great'].map((opt) => {
                              const isSelected = overallFeeling === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setOverallFeeling(opt)}
                                  className={`h-11 px-2 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Energy Level Pills */}
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Energy Level
                          </label>
                          <div className="grid grid-cols-5 gap-1.5">
                            {['Very Low', 'Low', 'Moderate', 'High', 'Very High'].map((opt) => {
                              const isSelected = energyLevel === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setEnergyLevel(opt)}
                                  className={`h-11 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SLEEP & RECOVERY */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sleep & Recovery</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Record your sleep schedule, duration, and restorative quality.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">Step 2 of 6</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Input
                            label="Sleep Hours"
                            type="number"
                            step="0.5"
                            min="0"
                            max="24"
                            placeholder="e.g. 7.5"
                            value={totalSleep}
                            onChange={(e) => {
                              setTotalSleep(sanitizeNumber(e.target.value));
                              if (fieldErrors.totalSleep) setFieldErrors((prev) => ({ ...prev, totalSleep: '' }));
                            }}
                            error={fieldErrors.totalSleep}
                            helperText={!fieldErrors.totalSleep ? 'Total duration slept last night' : undefined}
                          />
                        </div>

                        <div>
                          <Input
                            label="Sleep Goal (Hours)"
                            type="number"
                            step="0.5"
                            min="4"
                            max="14"
                            placeholder="e.g. 8.0"
                            value={sleepGoal}
                            onChange={(e) => {
                              setSleepGoal(sanitizeNumber(e.target.value));
                              if (fieldErrors.sleepGoal) setFieldErrors((prev) => ({ ...prev, sleepGoal: '' }));
                            }}
                            error={fieldErrors.sleepGoal}
                            helperText={!fieldErrors.sleepGoal ? 'Target sleep duration (4 - 14 hrs)' : undefined}
                          />
                        </div>

                        <Input
                          label="Bed Time"
                          type="time"
                          value={bedtime}
                          onChange={(e) => setBedtime(e.target.value)}
                        />

                        <Input
                          label="Wake-up Time"
                          type="time"
                          value={wakeUpTime}
                          onChange={(e) => setWakeUpTime(e.target.value)}
                        />

                        {/* Sleep Quality */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Sleep Quality
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {['Poor', 'Fair', 'Good', 'Excellent'].map((opt) => {
                              const isSelected = sleepQuality === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setSleepQuality(opt)}
                                  className={`h-11 px-1.5 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Woke up during night */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Woke up during the night?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {['No', 'Yes'].map((opt) => {
                              const isSelected = wokeUpDuringNight === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setWokeUpDuringNight(opt)}
                                  className={`h-11 px-3 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PHYSICAL ACTIVITY */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Physical Activity</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Track your steps, active walking, and workout routines.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">Step 3 of 6</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Input
                            label="Daily Steps Count"
                            type="number"
                            min="0"
                            max="100000"
                            placeholder="e.g. 6000"
                            value={steps}
                            onChange={(e) => {
                              setSteps(sanitizeNumber(e.target.value, false));
                              if (fieldErrors.steps) setFieldErrors((prev) => ({ ...prev, steps: '' }));
                            }}
                            error={fieldErrors.steps}
                            helperText={!fieldErrors.steps ? 'Target ~6,000 - 10,000 steps/day' : undefined}
                          />
                        </div>

                        <div>
                          <Input
                            label="Walking Duration (Minutes)"
                            type="number"
                            min="0"
                            max="1440"
                            placeholder="e.g. 30"
                            value={walkingMinutes}
                            onChange={(e) => {
                              setWalkingMinutes(sanitizeNumber(e.target.value, false));
                              if (fieldErrors.walkingMinutes)
                                setFieldErrors((prev) => ({ ...prev, walkingMinutes: '' }));
                            }}
                            error={fieldErrors.walkingMinutes}
                          />
                        </div>

                        {/* Exercise Intensity */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Exercise Intensity
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {['None', 'Light', 'Moderate', 'Intense'].map((opt) => {
                              const isSelected = exerciseIntensity === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setExerciseIntensity(opt)}
                                  className={`h-11 px-1.5 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Exercise Type */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Exercise Type
                          </label>
                          <select
                            value={exerciseType}
                            onChange={(e) => setExerciseType(e.target.value)}
                            className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 px-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                          >
                            <option value="Walking">Walking</option>
                            <option value="Running">Running</option>
                            <option value="Cycling">Cycling</option>
                            <option value="Yoga">Yoga</option>
                            <option value="Strength Training">Strength Training</option>
                            <option value="Swimming">Swimming</option>
                            <option value="HIIT / Cardio">HIIT / Cardio</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Workout Duration */}
                        <div className="sm:col-span-2">
                          <Input
                            label="Workout Duration (Minutes)"
                            type="number"
                            min="0"
                            max="1440"
                            placeholder="e.g. 30"
                            value={exerciseDuration}
                            onChange={(e) => {
                              setExerciseDuration(sanitizeNumber(e.target.value, false));
                              if (fieldErrors.exerciseDuration)
                                setFieldErrors((prev) => ({ ...prev, exerciseDuration: '' }));
                            }}
                            error={fieldErrors.exerciseDuration}
                            helperText="Time dedicated to structured exercise or training"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: HYDRATION */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hydration</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Log your fluid consumption and daily water target.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">Step 4 of 6</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Input
                            label="Water Consumed (Liters)"
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            placeholder="Enter water intake (e.g. 2.5)"
                            value={waterConsumed}
                            onChange={(e) => {
                              setWaterConsumed(sanitizeNumber(e.target.value));
                              if (fieldErrors.waterConsumed)
                                setFieldErrors((prev) => ({ ...prev, waterConsumed: '' }));
                            }}
                            error={fieldErrors.waterConsumed}
                          />
                        </div>

                        <div>
                          <Input
                            label="Daily Water Goal (Liters)"
                            type="number"
                            step="0.1"
                            min="0.5"
                            max="20"
                            placeholder="e.g. 2.5"
                            value={waterGoal}
                            onChange={(e) => {
                              setWaterGoal(sanitizeNumber(e.target.value));
                              if (fieldErrors.waterGoal) setFieldErrors((prev) => ({ ...prev, waterGoal: '' }));
                            }}
                            error={fieldErrors.waterGoal}
                            helperText="Recommended target: ~2.0 - 3.5 L/day"
                          />
                        </div>

                        {/* Interactive Water Slider & Quick Presets */}
                        <div className="sm:col-span-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Water Intake Quick Logger
                            </span>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              {waterConsumed ? `${waterConsumed} L` : '0.0 L'}
                            </span>
                          </div>

                          <input
                            type="range"
                            min="0"
                            max="6"
                            step="0.1"
                            value={waterConsumed !== '' ? parseFloat(waterConsumed) : 0}
                            onChange={(e) => {
                              setWaterConsumed(e.target.value);
                              if (fieldErrors.waterConsumed)
                                setFieldErrors((prev) => ({ ...prev, waterConsumed: '' }));
                            }}
                            className="w-full accent-indigo-600 cursor-pointer"
                            aria-label="Water Intake Slider"
                          />

                          {/* Quick Increment Buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {[
                              { label: '+250 ml', add: 0.25 },
                              { label: '+500 ml', add: 0.5 },
                              { label: '+1.0 L', add: 1.0 }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                  const cur = waterConsumed !== '' ? parseFloat(waterConsumed) : 0;
                                  const nextVal = Math.min(20, Number((cur + preset.add).toFixed(2)));
                                  setWaterConsumed(String(nextVal));
                                  if (fieldErrors.waterConsumed)
                                    setFieldErrors((prev) => ({ ...prev, waterConsumed: '' }));
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700/50 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Plus size={12} />
                                {preset.label}
                              </button>
                            ))}
                            {waterConsumed && (
                              <button
                                type="button"
                                onClick={() => setWaterConsumed('')}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                              >
                                <RotateCcw size={12} />
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: NUTRITION */}
                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Nutrition</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Log your meals count, whole foods, and dietary choices.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">Step 5 of 6</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Input
                            label="Meals Today"
                            type="number"
                            min="0"
                            max="10"
                            placeholder="e.g. 3"
                            value={mealsCount}
                            onChange={(e) => {
                              setMealsCount(sanitizeNumber(e.target.value, false));
                              if (fieldErrors.mealsCount) setFieldErrors((prev) => ({ ...prev, mealsCount: '' }));
                            }}
                            error={fieldErrors.mealsCount}
                          />
                        </div>

                        <div>
                          <Input
                            label="Fruit Servings"
                            type="number"
                            min="0"
                            max="30"
                            placeholder="e.g. 2"
                            value={fruitsServings}
                            onChange={(e) => {
                              setFruitsServings(sanitizeNumber(e.target.value, false));
                              if (fieldErrors.fruitsServings)
                                setFieldErrors((prev) => ({ ...prev, fruitsServings: '' }));
                            }}
                            error={fieldErrors.fruitsServings}
                            helperText="1 serving ≈ 1 medium apple or 1 cup berries"
                          />
                        </div>

                        <div>
                          <Input
                            label="Vegetable Servings"
                            type="number"
                            min="0"
                            max="30"
                            placeholder="e.g. 3"
                            value={vegetablesServings}
                            onChange={(e) => {
                              setVegetablesServings(sanitizeNumber(e.target.value, false));
                              if (fieldErrors.vegetablesServings)
                                setFieldErrors((prev) => ({ ...prev, vegetablesServings: '' }));
                            }}
                            error={fieldErrors.vegetablesServings}
                            helperText="1 serving ≈ 1 cup raw leafy greens or 0.5 cup cooked"
                          />
                        </div>

                        <div>
                          <Input
                            label="Protein Intake (Grams - Optional)"
                            type="number"
                            min="0"
                            max="500"
                            placeholder="e.g. 80"
                            value={proteinIntake}
                            onChange={(e) => {
                              setProteinIntake(sanitizeNumber(e.target.value, false));
                              if (fieldErrors.proteinIntake)
                                setFieldErrors((prev) => ({ ...prev, proteinIntake: '' }));
                            }}
                            error={fieldErrors.proteinIntake}
                          />
                        </div>

                        {/* Fast Food Selection */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Fast Food / Ultra-Processed
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {['None', 'Once', 'Multiple times'].map((opt) => {
                              const isSelected = fastFood === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setFastFood(opt)}
                                  className={`h-11 px-2 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Sugar Intake Selection */}
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Sugar Intake
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { label: 'Low', value: 'low' },
                              { label: 'Moderate', value: 'moderate' },
                              { label: 'High', value: 'high' }
                            ].map((opt) => {
                              const isSelected = sugarIntake === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setSugarIntake(opt.value)}
                                  className={`h-11 px-2 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: STRESS & WELLNESS */}
                  {currentStep === 6 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Stress & Wellness</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Check in on your mental wellness, mood state, and daily notes.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">Step 6 of 6</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Stress Level Slider */}
                        <div className="w-full flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>Stress Level</span>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                stressLevel <= 3
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  : stressLevel <= 6
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              }`}
                            >
                              {stressLevel} / 10
                            </span>
                          </label>
                          <div className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 flex items-center">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={stressLevel}
                              onChange={(e) => {
                                setStressLevel(parseInt(e.target.value, 10));
                                setStressInteracted(true);
                              }}
                              className="w-full accent-rose-500 cursor-pointer"
                              aria-label="Stress Level"
                            />
                          </div>
                        </div>

                        {/* Screen Time */}
                        <div>
                          <Input
                            label="Screen Time (Hours - Optional)"
                            type="number"
                            step="0.5"
                            min="0"
                            max="24"
                            placeholder="e.g. 4.5"
                            value={screenTime}
                            onChange={(e) => {
                              setScreenTime(sanitizeNumber(e.target.value));
                              if (fieldErrors.screenTime) setFieldErrors((prev) => ({ ...prev, screenTime: '' }));
                            }}
                            error={fieldErrors.screenTime}
                          />
                        </div>

                        {/* Mood Selector */}
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Mood State
                          </label>
                          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                            {[
                              { label: '😄 Great', value: 'great' },
                              { label: '🙂 Good', value: 'good' },
                              { label: '😐 Neutral', value: 'neutral' },
                              { label: '🥱 Tired', value: 'tired' },
                              { label: '😫 Stressed', value: 'stressed' }
                            ].map((opt) => {
                              const isSelected = mood === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setMood(opt.value)}
                                  className={`h-11 px-1 sm:px-2 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Daily Notes */}
                        <div className="sm:col-span-2 flex flex-col gap-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Personal Wellness Notes (Optional)
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="How are you feeling today? Any specific symptoms, triggers, dietary notes, or accomplishments?"
                            rows={3}
                            maxLength={1000}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors duration-200 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. FIXED ACTION FOOTER (Reference Image Style) */}
              <div className="px-5 sm:px-7 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
                {/* Previous Button */}
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handlePrev}
                    icon={<ChevronLeft size={16} />}
                    className="font-medium text-xs sm:text-sm cursor-pointer"
                  >
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {/* Right Action Button (Next or Save) */}
                <div className="flex items-center gap-2">
                  {currentStep < 6 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    >
                      <span>Next → {nextStepName}</span>
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      loading={loading}
                      className="font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 cursor-pointer"
                    >
                      <Check size={16} className="mr-1.5" />
                      {loading
                        ? 'Saving...'
                        : isEditing
                        ? "Update Today's Health"
                        : "Save Today's Health"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DailyTrackingModal;
