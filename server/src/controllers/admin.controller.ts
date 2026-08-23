import { Response } from 'express';
import { User } from '../models/User.js';
import { Assessment } from '../models/Assessment.js';
import { Report } from '../models/Report.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { HealthGoal } from '../models/HealthGoal.js';
import { Notification } from '../models/Notification.js';
import { WeeklyHealthReport } from '../models/WeeklyHealthReport.js';
import { formatResponse } from '../utils/helpers.js';
import { ENV } from '../config/env.js';

export const getStats = async (req: any, res: Response) => {
  try {
    const [
      totalUsers,
      totalAssessments,
      totalReports,
      totalChats,
      totalTrackingEntries,
      totalGoals,
      totalNotifications,
      totalWeeklyReports
    ] = await Promise.all([
      User.countDocuments(),
      Assessment.countDocuments(),
      Report.countDocuments(),
      ChatMessage.countDocuments().catch(() => 0),
      DailyHealthTracking.countDocuments().catch(() => 0),
      HealthGoal.countDocuments().catch(() => 0),
      Notification.countDocuments().catch(() => 0),
      WeeklyHealthReport.countDocuments().catch(() => 0)
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentAssessments = await Assessment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(formatResponse(true, {
      totalUsers,
      totalAssessments,
      totalReports,
      totalChats,
      totalTrackingEntries,
      totalGoals,
      totalNotifications,
      totalWeeklyReports,
      recentUsers,
      recentAssessments,
      adminEmail: ENV.ADMIN_EMAIL,
      systemStatus: 'Operational',
      timestamp: new Date().toISOString()
    }));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getUsers = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const [users, total] = await Promise.all([
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments()
    ]);

    res.json(formatResponse(true, {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getAssessments = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const [assessments, total] = await Promise.all([
      Assessment.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Assessment.countDocuments()
    ]);

    res.json(formatResponse(true, { assessments, total, page, limit }));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getLogs = async (req: any, res: Response) => {
  try {
    const logs = await Assessment.find().sort({ createdAt: -1 }).limit(20);
    res.json(formatResponse(true, logs));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json(formatResponse(false, null, 'User not found'));
    }

    // Security: Never allow deleting the primary administrator account
    if (user.email.toLowerCase().trim() === ENV.ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(403).json(formatResponse(false, null, 'Cannot delete the designated administrator account'));
    }

    await User.findByIdAndDelete(id);
    res.json(formatResponse(true, null, 'User deleted successfully'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};