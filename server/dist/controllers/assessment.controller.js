import { Assessment } from '../models/Assessment.js';
import { analyzeHealth } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
export const createAssessment = async (req, res) => {
    try {
        const data = req.body;
        const aiAnalysis = await analyzeHealth(data);
        const assessment = await Assessment.create({
            userId: req.user._id,
            ...data,
            aiAnalysis
        });
        res.status(201).json(formatResponse(true, assessment));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(formatResponse(true, assessments));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id });
        if (!assessment)
            return res.status(404).json(formatResponse(false, null, 'Assessment not found'));
        res.json(formatResponse(true, assessment));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
