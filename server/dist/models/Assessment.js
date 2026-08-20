import mongoose from 'mongoose';
const assessmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personalInfo: {
        name: String,
        age: Number,
        gender: String,
        height: Number,
        weight: Number,
        bloodGroup: String
    },
    lifestyle: {
        smoking: String,
        alcohol: String,
        exercise: String,
        sleep: Number,
        waterIntake: Number,
        stress: String
    },
    medical: {
        familyHistory: [String],
        medicalHistory: [String],
        symptoms: [String]
    },
    aiAnalysis: {
        healthScore: Number,
        healthSummary: String,
        riskFactors: [String],
        lifestyleImprovements: [String],
        dietSuggestions: [String],
        exerciseSuggestions: [String],
        hydrationAdvice: String,
        mentalWellnessTips: [String],
        preventiveCheckups: [String],
        whenToVisitDoctor: String
    }
}, { timestamps: true });
export const Assessment = mongoose.model('Assessment', assessmentSchema);
