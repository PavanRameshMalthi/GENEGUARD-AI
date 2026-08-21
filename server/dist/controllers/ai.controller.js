import { Assessment } from '../models/Assessment.js';
import { analyzeHealth, chatResponse } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
import { computeAllCalculations } from '../utils/calculations.js';
export const analyzeHealthData = async (req, res) => {
    try {
        const { assessmentId, ...data } = req.body || {};
        // If assessmentId is provided, analyze and update that assessment in DB
        if (assessmentId) {
            const assessment = await Assessment.findOne({ _id: assessmentId, userId: req.user._id });
            if (!assessment) {
                return res.status(404).json(formatResponse(false, null, 'Assessment not found'));
            }
            // Compute calculations if not present
            if (!assessment.calculations || !assessment.calculations.healthScore) {
                const input = {
                    age: assessment.personalInfo?.age || 30,
                    gender: assessment.personalInfo?.gender || 'male',
                    height: assessment.personalInfo?.height || 170,
                    weight: assessment.personalInfo?.weight || 70,
                    sleepHours: assessment.lifestyle?.sleepHours || 7,
                    dailyWaterIntake: assessment.lifestyle?.dailyWaterIntake || 2.5,
                    stressLevel: assessment.lifestyle?.stressLevel || 5,
                    smoking: assessment.lifestyle?.smoking || 'no',
                    alcohol: assessment.lifestyle?.alcohol || 'never',
                    stepsPerDay: assessment.physicalActivity?.stepsPerDay || 6000,
                    exerciseFrequency: assessment.physicalActivity?.exerciseFrequency || '1-2 times/week',
                    workoutDuration: assessment.physicalActivity?.workoutDuration || 30,
                    workingHours: assessment.lifestyle?.workingHours || 8,
                    mealsPerDay: assessment.nutrition?.mealsPerDay || 3,
                    fruitsPerWeek: assessment.nutrition?.fruitsPerWeek || 7,
                    vegetablesPerWeek: assessment.nutrition?.vegetablesPerWeek || 7,
                    fastFoodFrequency: assessment.nutrition?.fastFoodFrequency || 'never',
                    sugarIntake: assessment.nutrition?.sugarIntake || 'moderate',
                    medicalConditions: Object.keys(assessment.medicalHistory || {}).filter(k => assessment.medicalHistory[k] === true),
                    familyConditions: Object.keys(assessment.familyHistory || {}).filter(k => assessment.familyHistory[k] === true),
                    symptoms: assessment.symptoms || []
                };
                assessment.calculations = computeAllCalculations(input);
            }
            const analysis = await analyzeHealth(assessment.toObject());
            assessment.aiAnalysis = analysis;
            await assessment.save();
            return res.json(formatResponse(true, { analysis, assessment }));
        }
        // Otherwise analyze payload directly
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json(formatResponse(false, null, 'No health data provided'));
        }
        const input = {
            age: data.personalInfo?.age || 30,
            gender: data.personalInfo?.gender || 'male',
            height: data.personalInfo?.height || 170,
            weight: data.personalInfo?.weight || 70,
            sleepHours: data.lifestyle?.sleepHours || 7,
            dailyWaterIntake: data.lifestyle?.dailyWaterIntake || 2.5,
            stressLevel: data.lifestyle?.stressLevel || 5,
            smoking: data.lifestyle?.smoking || 'no',
            alcohol: data.lifestyle?.alcohol || 'never',
            stepsPerDay: data.physicalActivity?.stepsPerDay || 6000,
            exerciseFrequency: data.physicalActivity?.exerciseFrequency || '1-2 times/week',
            workoutDuration: data.physicalActivity?.workoutDuration || 30,
            workingHours: data.lifestyle?.workingHours || 8,
            mealsPerDay: data.nutrition?.mealsPerDay || 3,
            fruitsPerWeek: data.nutrition?.fruitsPerWeek || 7,
            vegetablesPerWeek: data.nutrition?.vegetablesPerWeek || 7,
            fastFoodFrequency: data.nutrition?.fastFoodFrequency || 'never',
            sugarIntake: data.nutrition?.sugarIntake || 'moderate',
            medicalConditions: Object.keys(data.medicalHistory || {}).filter(k => data.medicalHistory[k] === true),
            familyConditions: Object.keys(data.familyHistory || {}).filter(k => data.familyHistory[k] === true),
            symptoms: data.symptoms || []
        };
        const calculations = computeAllCalculations(input);
        const combinedData = { ...data, calculations };
        const analysis = await analyzeHealth(combinedData);
        return res.json(formatResponse(true, { analysis, calculations }));
    }
    catch (error) {
        console.error('AI Analysis Error:', error);
        res.status(500).json(formatResponse(false, null, "We're unable to generate your AI health insights right now. Please try again in a few moments."));
    }
};
export const chatWithAI = async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json(formatResponse(false, null, 'Message is required'));
        }
        const responseText = await chatResponse(history, message);
        res.json(formatResponse(true, { response: responseText }));
    }
    catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json(formatResponse(false, null, "We're unable to process your chat message right now. Please try again in a few moments."));
    }
};
