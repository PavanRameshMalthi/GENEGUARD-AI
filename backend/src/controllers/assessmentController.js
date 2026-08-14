const Assessment = require('../models/Assessment');

// @desc    Create new assessment
// @route   POST /api/assessments
// @access  Private
const createAssessment = async (req, res) => {
  try {
    const {
      age, height, weight, bloodPressure, diabetes, smoking, alcohol,
      exerciseFrequency, sleepHours, waterIntake, existingConditions,
      familyHistory, symptoms, stressLevel, medicalNotes, aiAnalysis
    } = req.body;

    const assessment = new Assessment({
      user: req.user._id,
      age, height, weight, bloodPressure, diabetes, smoking, alcohol,
      exerciseFrequency, sleepHours, waterIntake, existingConditions,
      familyHistory, symptoms, stressLevel, medicalNotes,
      aiAnalysis
    });

    const createdAssessment = await assessment.save();
    res.status(201).json(createdAssessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user assessments
// @route   GET /api/assessments
// @access  Private
const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAssessment, getAssessments };
