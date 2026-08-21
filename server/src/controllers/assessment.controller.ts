import { Response } from 'express';
import { Assessment } from '../models/Assessment.js';
import { analyzeHealth, generateSmartClinicalAnalysis } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
import { computeAllCalculations, CalculationInput } from '../utils/calculations.js';

export const createAssessment = async (req: any, res: Response) => {
  try {
    const data = req.body;
    const input: CalculationInput = {
      age: data.personalInfo?.age,
      gender: data.personalInfo?.gender,
      height: data.personalInfo?.height,
      weight: data.personalInfo?.weight,
      sleepHours: data.lifestyle?.sleepHours,
      dailyWaterIntake: data.lifestyle?.dailyWaterIntake,
      stressLevel: data.lifestyle?.stressLevel,
      smoking: data.lifestyle?.smoking,
      alcohol: data.lifestyle?.alcohol,
      stepsPerDay: data.physicalActivity?.stepsPerDay,
      exerciseFrequency: data.physicalActivity?.exerciseFrequency,
      workoutDuration: data.physicalActivity?.workoutDuration,
      workingHours: data.lifestyle?.workingHours,
      mealsPerDay: data.nutrition?.mealsPerDay,
      fruitsPerWeek: data.nutrition?.fruitsPerWeek,
      vegetablesPerWeek: data.nutrition?.vegetablesPerWeek,
      fastFoodFrequency: data.nutrition?.fastFoodFrequency,
      sugarIntake: data.nutrition?.sugarIntake,
      medicalConditions: Object.keys(data.medicalHistory || {}).filter(k => data.medicalHistory[k] === true),
      familyConditions: Object.keys(data.familyHistory || {}).filter(k => data.familyHistory[k] === true),
      symptoms: data.symptoms || []
    };
    
    const calculations = computeAllCalculations(input);
    const combinedData = { ...data, calculations };
    
    let aiAnalysis;
    try {
      aiAnalysis = await analyzeHealth(combinedData);
    } catch (aiErr) {
      console.warn('AI analysis error during assessment creation:', aiErr);
      aiAnalysis = generateSmartClinicalAnalysis(combinedData);
    }

    if (!aiAnalysis) {
      aiAnalysis = generateSmartClinicalAnalysis(combinedData);
    }

    const assessment = await Assessment.create({
      userId: req.user._id,
      ...combinedData,
      aiAnalysis
    });

    res.status(201).json(formatResponse(true, assessment));
  } catch (error: any) {
    console.error('Create Assessment Error:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to save health assessment.'));
  }
};

export const getLatestAssessment = async (req: any, res: Response) => {
  try {
    const assessment = await Assessment.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!assessment) return res.status(404).json(formatResponse(false, null, 'No assessment found'));
    
    // Auto-generate AI analysis if missing on legacy assessment
    if (!assessment.aiAnalysis || !assessment.aiAnalysis.overallHealthSummary) {
      const analysis = await analyzeHealth(assessment.toObject());
      assessment.aiAnalysis = analysis;
      await assessment.save();
    }

    res.json(formatResponse(true, assessment));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getAssessments = async (req: any, res: Response) => {
  try {
    const assessments = await Assessment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(formatResponse(true, assessments));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getAssessment = async (req: any, res: Response) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!assessment) return res.status(404).json(formatResponse(false, null, 'Assessment not found'));
    
    // Auto-generate AI analysis if missing on legacy assessment
    if (!assessment.aiAnalysis || !assessment.aiAnalysis.overallHealthSummary) {
      const analysis = await analyzeHealth(assessment.toObject());
      assessment.aiAnalysis = analysis;
      await assessment.save();
    }

    res.json(formatResponse(true, assessment));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};