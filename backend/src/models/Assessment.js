const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  age: { type: Number, required: true },
  height: { type: Number, required: true }, // in cm
  weight: { type: Number, required: true }, // in kg
  bloodPressure: { type: String },
  diabetes: { type: Boolean, default: false },
  smoking: { type: Boolean, default: false },
  alcohol: { type: Boolean, default: false },
  exerciseFrequency: { type: String }, // 'None', '1-2 times/week', '3-5 times/week', 'Daily'
  sleepHours: { type: Number },
  waterIntake: { type: Number }, // in Liters
  existingConditions: { type: String },
  familyHistory: { type: String },
  symptoms: { type: String },
  stressLevel: { type: String }, // 'Low', 'Medium', 'High'
  medicalNotes: { type: String },
  
  // AI Generated Results
  aiAnalysis: {
    healthScore: { type: Number }, // 0-100
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
    summary: { type: String },
    possibleRiskFactors: [{ type: String }],
    lifestyleSuggestions: [{ type: String }],
    dietRecommendations: [{ type: String }],
    exerciseSuggestions: [{ type: String }],
    sleepRecommendations: [{ type: String }],
    hydrationAdvice: [{ type: String }],
    mentalWellnessTips: [{ type: String }],
    whenToConsultDoctor: { type: String }
  },
  
  createdAt: { type: Date, default: Date.now },
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
