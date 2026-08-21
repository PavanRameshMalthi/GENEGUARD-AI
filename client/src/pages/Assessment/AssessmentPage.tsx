import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ProgressBar from '@/components/ui/ProgressBar';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { assessmentService } from '@/services/assessment.service';
import { useToast } from '@/hooks/useToast';
import { 
  BLOOD_GROUPS, GENDERS, SYMPTOMS_LIST, EXERCISE_FREQUENCIES, 
  FAST_FOOD_OPTIONS, SUGAR_INTAKE_OPTIONS, ALCOHOL_OPTIONS 
} from '@/utils/constants';
import {
  validateName, validateAge, validateHeight, validateWeight,
  validateDailyWaterIntake, validateSleepHours, validateScreenTime,
  validateWorkingHours, validateStressLevel, validateWalkingMinutes,
  validateStepsPerDay, validateWorkoutDuration, validateMealsPerDay,
  validateFruitsPerWeek, validateVegetablesPerWeek, validateWaterIntake,
  validateTimeFormat, validateEnum, validateRequired,
  sanitizeText, sanitizeNumericString
} from '@/utils/validation';

const STEPS = [
  'Personal Info', 'Lifestyle', 'Physical Activity', 
  'Nutrition', 'Medical History', 'Family History', 'Symptoms'
];

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { error: showError, warning: showWarning } = useToast();

  const [formData, setFormData] = useState({
    personalInfo: { name: '', age: '', gender: '', height: '', weight: '', bloodGroup: '' },
    lifestyle: {
      smoking: 'no', alcohol: 'never', dailyWaterIntake: '', sleepHours: '',
      wakeUpTime: '06:30', bedTime: '22:30', dailyScreenTime: '', stressLevel: '5',
      occupation: '', workingHours: ''
    },
    physicalActivity: {
      dailyWalkingMinutes: '', stepsPerDay: '', exerciseFrequency: 'never',
      exerciseType: '', workoutDuration: ''
    },
    nutrition: {
      mealsPerDay: '3', fruitsPerWeek: '', vegetablesPerWeek: '',
      fastFoodFrequency: 'never', sugarIntake: 'moderate', waterIntake: ''
    },
    medicalHistory: {
      diabetes: false, bloodPressure: false, heartDisease: false,
      asthma: false, thyroid: false, cholesterol: false, allergies: ''
    },
    familyHistory: {
      diabetes: false, heartDisease: false, cancer: false,
      hypertension: false, kidneyDisease: false
    },
    symptoms: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Field validation mapper
  const validateField = (section: string, field: string, value: any): string | null => {
    switch (`${section}.${field}`) {
      case 'personalInfo.name':
        return validateName(value);
      case 'personalInfo.age':
        return validateAge(value);
      case 'personalInfo.gender':
        return validateEnum(value, ['male', 'female', 'other', 'prefer not to say'], 'Gender');
      case 'personalInfo.height':
        return validateHeight(value);
      case 'personalInfo.weight':
        return validateWeight(value);
      case 'personalInfo.bloodGroup':
        return validateEnum(value, BLOOD_GROUPS, 'Blood Group');

      case 'lifestyle.smoking':
        return validateEnum(value, ['yes', 'no'], 'Smoking');
      case 'lifestyle.alcohol':
        return validateEnum(value, ['never', 'occasionally', 'frequently'], 'Alcohol');
      case 'lifestyle.dailyWaterIntake':
        return validateDailyWaterIntake(value);
      case 'lifestyle.sleepHours':
        return validateSleepHours(value);
      case 'lifestyle.wakeUpTime':
        return validateTimeFormat(value, 'Wake Up Time');
      case 'lifestyle.bedTime':
        return validateTimeFormat(value, 'Bed Time');
      case 'lifestyle.dailyScreenTime':
        return validateScreenTime(value);
      case 'lifestyle.occupation':
        return validateRequired(value, 'Occupation');
      case 'lifestyle.workingHours':
        return validateWorkingHours(value);
      case 'lifestyle.stressLevel':
        return validateStressLevel(value);

      case 'physicalActivity.dailyWalkingMinutes':
        return validateWalkingMinutes(value);
      case 'physicalActivity.stepsPerDay':
        return validateStepsPerDay(value);
      case 'physicalActivity.exerciseFrequency':
        return validateEnum(value, ['never', '1-2 times/week', '3-4 times/week', '5-6 times/week', 'daily'], 'Exercise Frequency');
      case 'physicalActivity.exerciseType':
        return validateRequired(value, 'Exercise Type');
      case 'physicalActivity.workoutDuration':
        return validateWorkoutDuration(value);

      case 'nutrition.mealsPerDay':
        return validateMealsPerDay(value);
      case 'nutrition.fruitsPerWeek':
        return validateFruitsPerWeek(value);
      case 'nutrition.vegetablesPerWeek':
        return validateVegetablesPerWeek(value);
      case 'nutrition.fastFoodFrequency':
        return validateEnum(value, ['never', 'once a week', '2-3 times/week', 'daily'], 'Fast Food Frequency');
      case 'nutrition.sugarIntake':
        return validateEnum(value, ['low', 'moderate', 'high'], 'Sugar Intake');
      case 'nutrition.waterIntake':
        return validateWaterIntake(value);

      default:
        return null;
    }
  };

  const handleFieldChange = (section: string, field: string, rawValue: any, isNumeric = false, allowDecimals = true) => {
    let value = rawValue;
    if (isNumeric && typeof rawValue === 'string') {
      value = sanitizeNumericString(rawValue, allowDecimals);
    }
    
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev as any)[section], [field]: value }
    }));

    const key = `${section}.${field}`;
    setTouched(prev => ({ ...prev, [key]: true }));
    const errorMsg = validateField(section, field, value);
    setErrors(prev => ({ ...prev, [key]: errorMsg }));
  };

  const handleBlur = (section: string, field: string) => {
    const key = `${section}.${field}`;
    const value = (formData as any)[section]?.[field];
    setTouched(prev => ({ ...prev, [key]: true }));
    const errorMsg = validateField(section, field, value);
    setErrors(prev => ({ ...prev, [key]: errorMsg }));
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const updateCheckbox = (section: 'medicalHistory' | 'familyHistory', key: string, val: boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev as any)[section], [key]: val }
    }));
  };

  // Step validation check
  const getStepValidation = (stepNum: number) => {
    const stepErrors: Record<string, string | null> = {};
    let isValid = true;

    const check = (section: string, field: string) => {
      const key = `${section}.${field}`;
      const val = (formData as any)[section]?.[field];
      const err = validateField(section, field, val);
      if (err) {
        isValid = false;
        stepErrors[key] = err;
      }
    };

    if (stepNum === 1) {
      check('personalInfo', 'name');
      check('personalInfo', 'age');
      check('personalInfo', 'gender');
      check('personalInfo', 'height');
      check('personalInfo', 'weight');
      check('personalInfo', 'bloodGroup');
    } else if (stepNum === 2) {
      check('lifestyle', 'smoking');
      check('lifestyle', 'alcohol');
      check('lifestyle', 'dailyWaterIntake');
      check('lifestyle', 'sleepHours');
      check('lifestyle', 'wakeUpTime');
      check('lifestyle', 'bedTime');
      check('lifestyle', 'dailyScreenTime');
      check('lifestyle', 'occupation');
      check('lifestyle', 'workingHours');
      check('lifestyle', 'stressLevel');
    } else if (stepNum === 3) {
      check('physicalActivity', 'dailyWalkingMinutes');
      check('physicalActivity', 'stepsPerDay');
      check('physicalActivity', 'exerciseFrequency');
      check('physicalActivity', 'exerciseType');
      check('physicalActivity', 'workoutDuration');
    } else if (stepNum === 4) {
      check('nutrition', 'mealsPerDay');
      check('nutrition', 'fruitsPerWeek');
      check('nutrition', 'vegetablesPerWeek');
      check('nutrition', 'fastFoodFrequency');
      check('nutrition', 'sugarIntake');
      check('nutrition', 'waterIntake');
    }

    return { isValid, stepErrors };
  };

  const isCurrentStepValid = getStepValidation(step).isValid;

  const handleNext = () => {
    const { isValid, stepErrors } = getStepValidation(step);
    if (!isValid) {
      // Mark all fields in current step as touched and show errors
      const newTouched = { ...touched };
      Object.keys(stepErrors).forEach(k => {
        newTouched[k] = true;
      });
      setTouched(newTouched);
      setErrors(prev => ({ ...prev, ...stepErrors }));
      showWarning('Please fix the highlighted errors before proceeding.');
      return;
    }
    setStep(s => Math.min(s + 1, 7));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify all steps
    for (let s = 1; s <= 4; s++) {
      const { isValid, stepErrors } = getStepValidation(s);
      if (!isValid) {
        setStep(s);
        setErrors(prev => ({ ...prev, ...stepErrors }));
        const newTouched = { ...touched };
        Object.keys(stepErrors).forEach(k => { newTouched[k] = true; });
        setTouched(newTouched);
        showError('Please resolve all validation errors in the assessment form.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Auto-sanitize all fields before sending
      const payload = {
        personalInfo: {
          name: sanitizeText(formData.personalInfo.name),
          age: Math.round(Number(formData.personalInfo.age)),
          gender: formData.personalInfo.gender,
          height: Number(Number(formData.personalInfo.height).toFixed(1)),
          weight: Number(Number(formData.personalInfo.weight).toFixed(1)),
          bloodGroup: formData.personalInfo.bloodGroup,
        },
        lifestyle: {
          smoking: formData.lifestyle.smoking,
          alcohol: formData.lifestyle.alcohol,
          dailyWaterIntake: Number(Number(formData.lifestyle.dailyWaterIntake).toFixed(1)),
          sleepHours: Number(Number(formData.lifestyle.sleepHours).toFixed(1)),
          wakeUpTime: sanitizeText(formData.lifestyle.wakeUpTime),
          bedTime: sanitizeText(formData.lifestyle.bedTime),
          dailyScreenTime: Number(Number(formData.lifestyle.dailyScreenTime).toFixed(1)),
          stressLevel: Math.round(Number(formData.lifestyle.stressLevel)),
          occupation: sanitizeText(formData.lifestyle.occupation),
          workingHours: Number(Number(formData.lifestyle.workingHours).toFixed(1)),
        },
        physicalActivity: {
          dailyWalkingMinutes: Math.round(Number(formData.physicalActivity.dailyWalkingMinutes)),
          stepsPerDay: Math.round(Number(formData.physicalActivity.stepsPerDay)),
          exerciseFrequency: formData.physicalActivity.exerciseFrequency,
          exerciseType: sanitizeText(formData.physicalActivity.exerciseType),
          workoutDuration: Math.round(Number(formData.physicalActivity.workoutDuration)),
        },
        nutrition: {
          mealsPerDay: Math.round(Number(formData.nutrition.mealsPerDay)),
          fruitsPerWeek: Math.round(Number(formData.nutrition.fruitsPerWeek)),
          vegetablesPerWeek: Math.round(Number(formData.nutrition.vegetablesPerWeek)),
          fastFoodFrequency: formData.nutrition.fastFoodFrequency,
          sugarIntake: formData.nutrition.sugarIntake,
          waterIntake: Number(Number(formData.nutrition.waterIntake).toFixed(1)),
        },
        medicalHistory: {
          ...formData.medicalHistory,
          allergies: sanitizeText(formData.medicalHistory.allergies)
        },
        familyHistory: formData.familyHistory,
        symptoms: formData.symptoms
      };

      const res = await assessmentService.createAssessment(payload);
      const assessment = res.data || res;
      const assessmentId = assessment?._id || assessment?.id;
      
      if (assessmentId) {
        navigate(`/assessment/${assessmentId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create assessment. Please check your data.';
      showError(msg);
      setIsSubmitting(false);
    }
  };

  const isFieldSuccess = (section: string, field: string) => {
    const key = `${section}.${field}`;
    const val = (formData as any)[section]?.[field];
    return Boolean(touched[key] && !errors[key] && val !== '' && val !== null && val !== undefined);
  };

  const renderCheckbox = (section: 'medicalHistory' | 'familyHistory', key: string, label: string) => (
    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <input
        type="checkbox"
        checked={(formData[section] as any)[key]}
        onChange={(e) => updateCheckbox(section, key, e.target.checked)}
        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-primary-600 dark:text-primary-400">Step {step} of 7</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">{STEPS[step - 1]}</span>
          </div>
          <ProgressBar value={(step / 7) * 100} animated color="primary" />
        </div>

        <Card glass padding="lg">
          <form onSubmit={handleSubmit} noValidate>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                    <h2 className="text-xl font-bold">Personal Information</h2>
                    <p className="text-sm text-gray-500">Provide accurate biological data for precise health metrics.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Full Name" 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={formData.personalInfo.name} 
                      onChange={e => handleFieldChange('personalInfo', 'name', e.target.value)} 
                      onBlur={() => handleBlur('personalInfo', 'name')}
                      error={touched['personalInfo.name'] ? (errors['personalInfo.name'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('personalInfo', 'name')}
                      required 
                    />
                    <Input 
                      label="Age (Years)" 
                      type="number" 
                      min={1} 
                      max={120} 
                      step="1"
                      inputMode="numeric"
                      integerOnly
                      placeholder="1–120"
                      value={formData.personalInfo.age} 
                      onChange={e => handleFieldChange('personalInfo', 'age', e.target.value, true, false)} 
                      onBlur={() => handleBlur('personalInfo', 'age')}
                      error={touched['personalInfo.age'] ? (errors['personalInfo.age'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('personalInfo', 'age')}
                      helperText="Must be a whole number between 1 and 120."
                      required 
                    />
                    <Select 
                      label="Gender" 
                      value={formData.personalInfo.gender} 
                      onChange={e => handleFieldChange('personalInfo', 'gender', e.target.value)} 
                      onBlur={() => handleBlur('personalInfo', 'gender')}
                      error={touched['personalInfo.gender'] ? (errors['personalInfo.gender'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('personalInfo', 'gender')}
                      options={[
                        { label: 'Select Gender', value: '' },
                        ...GENDERS.map(g => ({ label: g, value: g.toLowerCase() }))
                      ]} 
                      required 
                    />
                    <Input 
                      label="Height (cm)" 
                      type="number" 
                      min={50} 
                      max={250} 
                      step="0.1"
                      inputMode="decimal"
                      numericOnly
                      allowDecimals
                      placeholder="50–250"
                      value={formData.personalInfo.height} 
                      onChange={e => handleFieldChange('personalInfo', 'height', e.target.value, true, true)} 
                      onBlur={() => handleBlur('personalInfo', 'height')}
                      error={touched['personalInfo.height'] ? (errors['personalInfo.height'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('personalInfo', 'height')}
                      helperText="Allowed range: 50–250 cm."
                      required 
                    />
                    <Input 
                      label="Weight (kg)" 
                      type="number" 
                      min={10} 
                      max={500} 
                      step="0.1"
                      inputMode="decimal"
                      numericOnly
                      allowDecimals
                      placeholder="10–500"
                      value={formData.personalInfo.weight} 
                      onChange={e => handleFieldChange('personalInfo', 'weight', e.target.value, true, true)} 
                      onBlur={() => handleBlur('personalInfo', 'weight')}
                      error={touched['personalInfo.weight'] ? (errors['personalInfo.weight'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('personalInfo', 'weight')}
                      helperText="Allowed range: 10–500 kg."
                      required 
                    />
                    <Select 
                      label="Blood Group" 
                      value={formData.personalInfo.bloodGroup} 
                      onChange={e => handleFieldChange('personalInfo', 'bloodGroup', e.target.value)} 
                      onBlur={() => handleBlur('personalInfo', 'bloodGroup')}
                      error={touched['personalInfo.bloodGroup'] ? (errors['personalInfo.bloodGroup'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('personalInfo', 'bloodGroup')}
                      options={[
                        { label: 'Select Blood Group', value: '' },
                        ...BLOOD_GROUPS.map(b => ({ label: b, value: b }))
                      ]} 
                      required 
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                    <h2 className="text-xl font-bold">Lifestyle Factors</h2>
                    <p className="text-sm text-gray-500">Track daily habits, sleep rhythm, and working conditions.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select 
                      label="Smoking Habits" 
                      value={formData.lifestyle.smoking} 
                      onChange={e => handleFieldChange('lifestyle', 'smoking', e.target.value)} 
                      onBlur={() => handleBlur('lifestyle', 'smoking')}
                      error={touched['lifestyle.smoking'] ? (errors['lifestyle.smoking'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'smoking')}
                      options={[{label: 'No (Non-smoker)', value: 'no'}, {label: 'Yes (Smoker)', value: 'yes'}]} 
                      required 
                    />
                    <Select 
                      label="Alcohol Consumption" 
                      value={formData.lifestyle.alcohol} 
                      onChange={e => handleFieldChange('lifestyle', 'alcohol', e.target.value)} 
                      onBlur={() => handleBlur('lifestyle', 'alcohol')}
                      error={touched['lifestyle.alcohol'] ? (errors['lifestyle.alcohol'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'alcohol')}
                      options={ALCOHOL_OPTIONS} 
                      required 
                    />
                    <Input 
                      label="Daily Water Intake (Liters)" 
                      type="number" 
                      min={0.5} 
                      max={10} 
                      step="0.1" 
                      inputMode="decimal"
                      numericOnly
                      allowDecimals
                      placeholder="0.5–10"
                      value={formData.lifestyle.dailyWaterIntake} 
                      onChange={e => handleFieldChange('lifestyle', 'dailyWaterIntake', e.target.value, true, true)} 
                      onBlur={() => handleBlur('lifestyle', 'dailyWaterIntake')}
                      error={touched['lifestyle.dailyWaterIntake'] ? (errors['lifestyle.dailyWaterIntake'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'dailyWaterIntake')}
                      helperText="Allowed: 0.5 to 10 Liters/day."
                      required 
                    />
                    <Input 
                      label="Sleep Hours" 
                      type="number" 
                      min={0} 
                      max={24} 
                      step="0.5" 
                      inputMode="decimal"
                      numericOnly
                      allowDecimals
                      placeholder="0–24"
                      value={formData.lifestyle.sleepHours} 
                      onChange={e => handleFieldChange('lifestyle', 'sleepHours', e.target.value, true, true)} 
                      onBlur={() => handleBlur('lifestyle', 'sleepHours')}
                      error={touched['lifestyle.sleepHours'] ? (errors['lifestyle.sleepHours'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'sleepHours')}
                      helperText="Allowed: 0 to 24 hours."
                      required 
                    />
                    <Input 
                      label="Wake Up Time" 
                      type="time" 
                      value={formData.lifestyle.wakeUpTime} 
                      onChange={e => handleFieldChange('lifestyle', 'wakeUpTime', e.target.value)} 
                      onBlur={() => handleBlur('lifestyle', 'wakeUpTime')}
                      error={touched['lifestyle.wakeUpTime'] ? (errors['lifestyle.wakeUpTime'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'wakeUpTime')}
                      required 
                    />
                    <Input 
                      label="Bed Time" 
                      type="time" 
                      value={formData.lifestyle.bedTime} 
                      onChange={e => handleFieldChange('lifestyle', 'bedTime', e.target.value)} 
                      onBlur={() => handleBlur('lifestyle', 'bedTime')}
                      error={touched['lifestyle.bedTime'] ? (errors['lifestyle.bedTime'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'bedTime')}
                      required 
                    />
                    <Input 
                      label="Daily Screen Time (Hours)" 
                      type="number" 
                      min={0} 
                      max={24} 
                      step="0.5" 
                      inputMode="decimal"
                      numericOnly
                      allowDecimals
                      placeholder="0–24"
                      value={formData.lifestyle.dailyScreenTime} 
                      onChange={e => handleFieldChange('lifestyle', 'dailyScreenTime', e.target.value, true, true)} 
                      onBlur={() => handleBlur('lifestyle', 'dailyScreenTime')}
                      error={touched['lifestyle.dailyScreenTime'] ? (errors['lifestyle.dailyScreenTime'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'dailyScreenTime')}
                      helperText="Allowed: 0 to 24 hours."
                      required 
                    />
                    <Input 
                      label="Occupation" 
                      type="text" 
                      placeholder="e.g. Software Engineer"
                      value={formData.lifestyle.occupation} 
                      onChange={e => handleFieldChange('lifestyle', 'occupation', e.target.value)} 
                      onBlur={() => handleBlur('lifestyle', 'occupation')}
                      error={touched['lifestyle.occupation'] ? (errors['lifestyle.occupation'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'occupation')}
                      required 
                    />
                    <Input 
                      label="Working Hours (Per Day)" 
                      type="number" 
                      min={0} 
                      max={24} 
                      step="0.5" 
                      inputMode="decimal"
                      numericOnly
                      allowDecimals
                      placeholder="0–24"
                      value={formData.lifestyle.workingHours} 
                      onChange={e => handleFieldChange('lifestyle', 'workingHours', e.target.value, true, true)} 
                      onBlur={() => handleBlur('lifestyle', 'workingHours')}
                      error={touched['lifestyle.workingHours'] ? (errors['lifestyle.workingHours'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('lifestyle', 'workingHours')}
                      helperText="Allowed: 0 to 24 hours."
                      required 
                    />
                    <div className="col-span-1 md:col-span-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Stress Level: <span className="text-primary-600 font-bold text-base">{formData.lifestyle.stressLevel}/10</span>
                        </label>
                        <span className="text-xs text-gray-500">Scale of 1 (Lowest) to 10 (Highest)</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="1"
                        value={formData.lifestyle.stressLevel} 
                        onChange={e => handleFieldChange('lifestyle', 'stressLevel', e.target.value, true, false)} 
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                    <h2 className="text-xl font-bold">Physical Activity</h2>
                    <p className="text-sm text-gray-500">Record your walking, workout intensity, and movement patterns.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Daily Walking Minutes" 
                      type="number" 
                      min={0} 
                      max={600} 
                      step="1"
                      inputMode="numeric"
                      integerOnly
                      placeholder="0–600"
                      value={formData.physicalActivity.dailyWalkingMinutes} 
                      onChange={e => handleFieldChange('physicalActivity', 'dailyWalkingMinutes', e.target.value, true, false)} 
                      onBlur={() => handleBlur('physicalActivity', 'dailyWalkingMinutes')}
                      error={touched['physicalActivity.dailyWalkingMinutes'] ? (errors['physicalActivity.dailyWalkingMinutes'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('physicalActivity', 'dailyWalkingMinutes')}
                      helperText="Allowed: 0 to 600 minutes (up to 10 hours)."
                      required 
                    />
                    <Input 
                      label="Steps Per Day" 
                      type="number" 
                      min={0} 
                      max={100000} 
                      step="1"
                      inputMode="numeric"
                      integerOnly
                      placeholder="0–100,000"
                      value={formData.physicalActivity.stepsPerDay} 
                      onChange={e => handleFieldChange('physicalActivity', 'stepsPerDay', e.target.value, true, false)} 
                      onBlur={() => handleBlur('physicalActivity', 'stepsPerDay')}
                      error={touched['physicalActivity.stepsPerDay'] ? (errors['physicalActivity.stepsPerDay'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('physicalActivity', 'stepsPerDay')}
                      helperText="Allowed: 0 to 100,000 steps."
                      required 
                    />
                    <Select 
                      label="Exercise Frequency" 
                      value={formData.physicalActivity.exerciseFrequency} 
                      onChange={e => handleFieldChange('physicalActivity', 'exerciseFrequency', e.target.value)} 
                      onBlur={() => handleBlur('physicalActivity', 'exerciseFrequency')}
                      error={touched['physicalActivity.exerciseFrequency'] ? (errors['physicalActivity.exerciseFrequency'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('physicalActivity', 'exerciseFrequency')}
                      options={EXERCISE_FREQUENCIES} 
                      required 
                    />
                    <Input 
                      label="Primary Exercise Type" 
                      type="text" 
                      placeholder="e.g. Running, Yoga, Gym, Cycling"
                      value={formData.physicalActivity.exerciseType} 
                      onChange={e => handleFieldChange('physicalActivity', 'exerciseType', e.target.value)} 
                      onBlur={() => handleBlur('physicalActivity', 'exerciseType')}
                      error={touched['physicalActivity.exerciseType'] ? (errors['physicalActivity.exerciseType'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('physicalActivity', 'exerciseType')}
                      required 
                    />
                    <Input 
                      label="Workout Duration (Minutes)" 
                      type="number" 
                      min={0} 
                      max={300} 
                      step="1"
                      inputMode="numeric"
                      integerOnly
                      placeholder="0–300"
                      value={formData.physicalActivity.workoutDuration} 
                      onChange={e => handleFieldChange('physicalActivity', 'workoutDuration', e.target.value, true, false)} 
                      onBlur={() => handleBlur('physicalActivity', 'workoutDuration')}
                      error={touched['physicalActivity.workoutDuration'] ? (errors['physicalActivity.workoutDuration'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('physicalActivity', 'workoutDuration')}
                      helperText="Allowed: 0 to 300 minutes (up to 5 hours)."
                      required 
                    />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                    <h2 className="text-xl font-bold">Nutrition & Diet</h2>
                    <p className="text-sm text-gray-500">Evaluate dietary patterns, meal frequencies, and hydration habits.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Meals Per Day" 
                      type="number" 
                      min={1} 
                      max={10} 
                      step="1"
                      inputMode="numeric"
                      integerOnly
                      placeholder="1–10"
                      value={formData.nutrition.mealsPerDay} 
                      onChange={e => handleFieldChange('nutrition', 'mealsPerDay', e.target.value, true, false)} 
                      onBlur={() => handleBlur('nutrition', 'mealsPerDay')}
                      error={touched['nutrition.mealsPerDay'] ? (errors['nutrition.mealsPerDay'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('nutrition', 'mealsPerDay')}
                      helperText="Allowed: 1 to 10 meals."
                      required 
                    />
                    <Input 
                      label="Fruits Servings (Per Week)" 
                      type="number" 
                      min={0} 
                      max={100} 
                      step="1"
                      inputMode="numeric"
                      integerOnly
                      placeholder="0–100"
                      value={formData.nutrition.fruitsPerWeek} 
                      onChange={e => handleFieldChange('nutrition', 'fruitsPerWeek', e.target.value, true, false)} 
                      onBlur={() => handleBlur('nutrition', 'fruitsPerWeek')}
                      error={touched['nutrition.fruitsPerWeek'] ? (errors['nutrition.fruitsPerWeek'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('nutrition', 'fruitsPerWeek')}
                      helperText="Allowed: 0 to 100 servings."
                      required 
                    />
                    <Input 
                      label="Vegetables Servings (Per Week)" 
                      type="number" 
                      min={0} 
                      max={100} 
                      step="1"
                      inputMode="numeric"
                      integerOnly
                      placeholder="0–100"
                      value={formData.nutrition.vegetablesPerWeek} 
                      onChange={e => handleFieldChange('nutrition', 'vegetablesPerWeek', e.target.value, true, false)} 
                      onBlur={() => handleBlur('nutrition', 'vegetablesPerWeek')}
                      error={touched['nutrition.vegetablesPerWeek'] ? (errors['nutrition.vegetablesPerWeek'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('nutrition', 'vegetablesPerWeek')}
                      helperText="Allowed: 0 to 100 servings."
                      required 
                    />
                    <Select 
                      label="Fast Food Frequency" 
                      value={formData.nutrition.fastFoodFrequency} 
                      onChange={e => handleFieldChange('nutrition', 'fastFoodFrequency', e.target.value)} 
                      onBlur={() => handleBlur('nutrition', 'fastFoodFrequency')}
                      error={touched['nutrition.fastFoodFrequency'] ? (errors['nutrition.fastFoodFrequency'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('nutrition', 'fastFoodFrequency')}
                      options={FAST_FOOD_OPTIONS} 
                      required 
                    />
                    <Select 
                      label="Sugar Intake Level" 
                      value={formData.nutrition.sugarIntake} 
                      onChange={e => handleFieldChange('nutrition', 'sugarIntake', e.target.value)} 
                      onBlur={() => handleBlur('nutrition', 'sugarIntake')}
                      error={touched['nutrition.sugarIntake'] ? (errors['nutrition.sugarIntake'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('nutrition', 'sugarIntake')}
                      options={SUGAR_INTAKE_OPTIONS} 
                      required 
                    />
                    <Input 
                      label="Water Intake (Glasses / Day)" 
                      type="number" 
                      min={0} 
                      max={50} 
                      step="1" 
                      inputMode="numeric"
                      integerOnly
                      placeholder="0–50"
                      value={formData.nutrition.waterIntake} 
                      onChange={e => handleFieldChange('nutrition', 'waterIntake', e.target.value, true, false)} 
                      onBlur={() => handleBlur('nutrition', 'waterIntake')}
                      error={touched['nutrition.waterIntake'] ? (errors['nutrition.waterIntake'] || undefined) : undefined}
                      isSuccess={isFieldSuccess('nutrition', 'waterIntake')}
                      helperText="Allowed: 0 to 50 glasses."
                      required 
                    />
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                    <h2 className="text-xl font-bold">Personal Medical History</h2>
                    <p className="text-sm text-gray-500">Select any diagnosed medical conditions or ongoing allergies.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderCheckbox('medicalHistory', 'diabetes', 'Diabetes (Type 1 or 2)')}
                    {renderCheckbox('medicalHistory', 'bloodPressure', 'Hypertension / Blood Pressure')}
                    {renderCheckbox('medicalHistory', 'heartDisease', 'Heart Disease / Cardiovascular')}
                    {renderCheckbox('medicalHistory', 'asthma', 'Asthma / Respiratory Conditions')}
                    {renderCheckbox('medicalHistory', 'thyroid', 'Thyroid Disorder')}
                    {renderCheckbox('medicalHistory', 'cholesterol', 'High Cholesterol')}
                    <div className="col-span-1 md:col-span-2">
                      <Input 
                        label="Known Allergies (Optional)" 
                        type="text" 
                        placeholder="e.g. Peanuts, Penicillin, Dust, Shellfish" 
                        maxLength={200}
                        value={formData.medicalHistory.allergies} 
                        onChange={e => handleFieldChange('medicalHistory', 'allergies', e.target.value)} 
                        helperText="List any food, drug, or seasonal allergies."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                    <h2 className="text-xl font-bold">Family Medical History</h2>
                    <p className="text-sm text-gray-500">Select known conditions diagnosed in direct biological family members.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderCheckbox('familyHistory', 'diabetes', 'Family Diabetes')}
                    {renderCheckbox('familyHistory', 'heartDisease', 'Family Heart Disease')}
                    {renderCheckbox('familyHistory', 'cancer', 'Family Cancer History')}
                    {renderCheckbox('familyHistory', 'hypertension', 'Family Hypertension')}
                    {renderCheckbox('familyHistory', 'kidneyDisease', 'Family Kidney Disease')}
                  </div>
                </motion.div>
              )}

              {step === 7 && (
                <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                    <h2 className="text-xl font-bold">Current Symptoms</h2>
                    <p className="text-sm text-gray-500">Select any symptoms you are currently experiencing (or leave unselected if none).</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SYMPTOMS_LIST.map(symptom => (
                      <label key={symptom} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.symptoms.includes(symptom)}
                          onChange={() => toggleSymptom(symptom)}
                          className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{symptom}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1 || isSubmitting}>
                Back
              </Button>
              {step < 7 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={!isCurrentStepValid}
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="px-8 py-3 text-base shadow-lg shadow-primary-500/25"
                >
                  {isSubmitting ? 'Analyzing your health with AI...' : 'Submit Assessment'}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      <Modal isOpen={isSubmitting} onClose={() => {}} title="Health Intelligence Engine">
        <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-primary-200 dark:border-primary-900/50 border-t-primary-600 animate-spin"></div>
            <div className="absolute w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl">🧬</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Analyzing your health with AI...
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              Processing your biometric metrics, lifestyle factors, and clinical indicators to generate personalized wellness recommendations.
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
