import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  personalInfo: {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      minlength: 2, 
      maxlength: 100 
    },
    age: { 
      type: Number, 
      required: true, 
      min: [1, 'Age must be at least 1'], 
      max: [120, 'Age cannot exceed 120'] 
    },
    gender: { 
      type: String, 
      required: true, 
      enum: ['male', 'female', 'other', 'prefer not to say'] 
    },
    height: { 
      type: Number, 
      required: true, 
      min: [50, 'Height must be at least 50 cm'], 
      max: [250, 'Height cannot exceed 250 cm'] 
    },
    weight: { 
      type: Number, 
      required: true, 
      min: [10, 'Weight must be at least 10 kg'], 
      max: [500, 'Weight cannot exceed 500 kg'] 
    },
    bloodGroup: { 
      type: String, 
      required: true, 
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
    }
  },
  
  lifestyle: {
    smoking: { 
      type: String, 
      required: true, 
      enum: ['yes', 'no'] 
    },
    alcohol: { 
      type: String, 
      required: true, 
      enum: ['never', 'occasionally', 'frequently'] 
    },
    dailyWaterIntake: { 
      type: Number, 
      required: true, 
      min: [0.5, 'Water intake must be at least 0.5 Liters'], 
      max: [10, 'Water intake cannot exceed 10 Liters'] 
    },
    sleepHours: { 
      type: Number, 
      required: true, 
      min: [0, 'Sleep hours cannot be negative'], 
      max: [24, 'Sleep hours cannot exceed 24'] 
    },
    wakeUpTime: { 
      type: String, 
      required: true, 
      trim: true, 
      match: /^([01]\d|2[0-3]):([0-5]\d)$/ 
    },
    bedTime: { 
      type: String, 
      required: true, 
      trim: true, 
      match: /^([01]\d|2[0-3]):([0-5]\d)$/ 
    },
    dailyScreenTime: { 
      type: Number, 
      required: true, 
      min: [0, 'Screen time cannot be negative'], 
      max: [24, 'Screen time cannot exceed 24'] 
    },
    stressLevel: { 
      type: Number, 
      required: true, 
      min: [1, 'Stress level must be at least 1'], 
      max: [10, 'Stress level cannot exceed 10'] 
    },
    occupation: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 100 
    },
    workingHours: { 
      type: Number, 
      required: true, 
      min: [0, 'Working hours cannot be negative'], 
      max: [24, 'Working hours cannot exceed 24'] 
    }
  },
  
  physicalActivity: {
    dailyWalkingMinutes: { 
      type: Number, 
      required: true, 
      min: [0, 'Walking minutes cannot be negative'], 
      max: [600, 'Walking minutes cannot exceed 600'] 
    },
    stepsPerDay: { 
      type: Number, 
      required: true, 
      min: [0, 'Steps cannot be negative'], 
      max: [100000, 'Steps cannot exceed 100,000'] 
    },
    exerciseFrequency: { 
      type: String, 
      required: true, 
      enum: ['never', '1-2 times/week', '3-4 times/week', '5-6 times/week', 'daily'] 
    },
    exerciseType: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 100 
    },
    workoutDuration: { 
      type: Number, 
      required: true, 
      min: [0, 'Workout duration cannot be negative'], 
      max: [300, 'Workout duration cannot exceed 300 minutes'] 
    }
  },
  
  nutrition: {
    mealsPerDay: { 
      type: Number, 
      required: true, 
      min: [1, 'Meals per day must be at least 1'], 
      max: [10, 'Meals per day cannot exceed 10'] 
    },
    fruitsPerWeek: { 
      type: Number, 
      required: true, 
      min: [0, 'Fruits per week cannot be negative'], 
      max: [100, 'Fruits per week cannot exceed 100'] 
    },
    vegetablesPerWeek: { 
      type: Number, 
      required: true, 
      min: [0, 'Vegetables per week cannot be negative'], 
      max: [100, 'Vegetables per week cannot exceed 100'] 
    },
    fastFoodFrequency: { 
      type: String, 
      required: true, 
      enum: ['never', 'once a week', '2-3 times/week', 'daily'] 
    },
    sugarIntake: { 
      type: String, 
      required: true, 
      enum: ['low', 'moderate', 'high'] 
    },
    waterIntake: { 
      type: Number, 
      required: true, 
      min: [0, 'Water intake cannot be negative'], 
      max: [50, 'Water intake cannot exceed 50'] 
    }
  },
  
  medicalHistory: {
    diabetes: { type: Boolean, default: false },
    bloodPressure: { type: Boolean, default: false },
    heartDisease: { type: Boolean, default: false },
    asthma: { type: Boolean, default: false },
    thyroid: { type: Boolean, default: false },
    cholesterol: { type: Boolean, default: false },
    allergies: { type: String, trim: true, maxlength: 200, default: '' }
  },
  
  familyHistory: {
    diabetes: { type: Boolean, default: false },
    heartDisease: { type: Boolean, default: false },
    cancer: { type: Boolean, default: false },
    hypertension: { type: Boolean, default: false },
    kidneyDisease: { type: Boolean, default: false }
  },
  
  symptoms: [{ type: String, trim: true }],
  
  calculations: {
    bmi: Number,
    bmiCategory: String,
    idealWeightMin: Number,
    idealWeightMax: Number,
    dailyWaterRequirement: Number,
    recommendedSleep: Number,
    caloriesNeeded: Number,
    activityLevel: String,
    healthScore: Number,
    riskLevel: String
  },
  
  aiAnalysis: {
    overallHealthSummary: String,
    healthScore: Number,
    riskFactors: [String],
    dietPlan: {
      breakfast: [String],
      lunch: [String],
      dinner: [String],
      snacks: [String],
      avoidFoods: [String],
      healthyFoods: [String],
      proteinTips: String,
      fiberTips: String,
      sugarReduction: String
    },
    exercisePlan: {
      beginner: [{
        name: String,
        duration: String,
        caloriesBurned: String,
        frequency: String,
        difficulty: String
      }],
      intermediate: [{
        name: String,
        duration: String,
        caloriesBurned: String,
        frequency: String,
        difficulty: String
      }],
      advanced: [{
        name: String,
        duration: String,
        caloriesBurned: String,
        frequency: String,
        difficulty: String
      }]
    },
    sleepAnalysis: {
      quality: String,
      idealBedTime: String,
      idealWakeTime: String,
      tips: [String]
    },
    hydrationAnalysis: {
      goal: Number,
      current: Number,
      remaining: Number,
      tips: [String]
    },
    stressManagement: [String],
    lifestyleImprovements: [String],
    weeklyGoals: [String],
    preventiveHealthAdvice: [String],
    medicalCheckupSuggestions: [String],
    whenToVisitDoctor: String
  }
}, { timestamps: true });

export const Assessment = mongoose.model('Assessment', assessmentSchema);