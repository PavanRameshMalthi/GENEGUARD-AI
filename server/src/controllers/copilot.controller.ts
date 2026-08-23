import { Response } from 'express';
import { generateCopilotResponse } from '../services/gemini.service.js';
import { Assessment } from '../models/Assessment.js';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { HealthGoal } from '../models/HealthGoal.js';
import { Report } from '../models/Report.js';
import { FamilyMember } from '../models/FamilyMember.js';
import { formatResponse } from '../utils/helpers.js';

export const copilotChat = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { message, chatHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json(formatResponse(false, null, 'Message is required'));
    }

    // Gather holistic patient context
    const [latestAssessment, recentTracking, activeGoals, recentReports, familyHistory] = await Promise.all([
      Assessment.findOne({ userId }).sort({ createdAt: -1 }),
      DailyHealthTracking.find({ userId }).sort({ date: -1 }).limit(7),
      HealthGoal.find({ userId, status: 'In Progress' }),
      Report.find({ userId }).sort({ createdAt: -1 }).limit(5),
      FamilyMember.find({ userId })
    ]);

    const context = {
      profile: req.user.profile,
      latestAssessment,
      recentTracking,
      activeGoals,
      recentReports,
      familyHistory
    };

    const response = await generateCopilotResponse(context, message, chatHistory);

    res.json(formatResponse(true, response));
  } catch (error: any) {
    console.error('Copilot chat error:', error);
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getCopilotContextSummary = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const [latestAssessment, recentTracking, activeGoals, recentReports, familyMembers] = await Promise.all([
      Assessment.findOne({ userId }).sort({ createdAt: -1 }),
      DailyHealthTracking.find({ userId }).sort({ date: -1 }).limit(7),
      HealthGoal.find({ userId, status: 'In Progress' }),
      Report.find({ userId }).sort({ createdAt: -1 }).limit(3),
      FamilyMember.find({ userId })
    ]);

    res.json(formatResponse(true, {
      hasAssessment: !!latestAssessment,
      healthScore: latestAssessment?.calculations?.healthScore || null,
      riskLevel: latestAssessment?.calculations?.riskLevel || null,
      trackingDaysCount: recentTracking.length,
      activeGoalsCount: activeGoals.length,
      reportsCount: recentReports.length,
      familyMembersCount: familyMembers.length
    }));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};
