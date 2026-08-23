import { Response } from 'express';
import fs from 'fs';
import { User } from '../models/User.js';
import { Assessment } from '../models/Assessment.js';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { Report } from '../models/Report.js';
import { HealthGoal } from '../models/HealthGoal.js';
import { PreventiveEvent } from '../models/PreventiveEvent.js';
import { FamilyMember } from '../models/FamilyMember.js';
import { UserAchievement } from '../models/Achievement.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { Notification } from '../models/Notification.js';
import { formatResponse } from '../utils/helpers.js';
import { ENV } from '../config/env.js';

export const getProfile = async (req: any, res: Response) => {
  res.json(formatResponse(true, req.user));
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json(formatResponse(false, null, 'User not found'));
    
    const { name, age, gender, height, weight, bloodGroup, medicalHistory, familyHistory } = req.body;
    
    if (name && typeof name === 'string') {
      user.name = name.trim();
    }

    const updatedProfile: any = { ...user.profile };
    if (age !== undefined) updatedProfile.age = age;
    if (gender !== undefined) updatedProfile.gender = gender;
    if (height !== undefined) updatedProfile.height = height;
    if (weight !== undefined) updatedProfile.weight = weight;
    if (bloodGroup !== undefined) updatedProfile.bloodGroup = bloodGroup;
    if (medicalHistory !== undefined) updatedProfile.medicalHistory = medicalHistory;
    if (familyHistory !== undefined) updatedProfile.familyHistory = familyHistory;

    user.profile = updatedProfile;
    await user.save();
    
    res.json(formatResponse(true, user));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const updateSettings = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json(formatResponse(false, null, 'User not found'));
    
    const { theme, notifications, language, privacy } = req.body;
    const currentSettings = user.settings || {};
    
    if (theme !== undefined) currentSettings.theme = theme;
    if (notifications !== undefined) currentSettings.notifications = Boolean(notifications);
    if (language !== undefined) currentSettings.language = language;
    if (privacy !== undefined) {
      currentSettings.privacy = {
        shareData: privacy.shareData !== undefined ? Boolean(privacy.shareData) : currentSettings.privacy?.shareData || false,
        analytics: privacy.analytics !== undefined ? Boolean(privacy.analytics) : currentSettings.privacy?.analytics || true
      };
    }

    user.settings = currentSettings;
    await user.save();
    res.json(formatResponse(true, user));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const updatePassword = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json(formatResponse(false, null, 'User not found'));
    
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json(formatResponse(false, null, 'Old password and new password are required'));
    }

    if (!(await user.comparePassword(oldPassword))) {
      return res.status(400).json(formatResponse(false, null, 'Invalid old password'));
    }
    
    user.password = newPassword;
    await user.save();
    res.json(formatResponse(true, null, 'Password updated successfully'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

// ==========================================
// 8. GDPR / HIPAA Complete Data Export
// ==========================================
export const exportUserDataJSON = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;

    const [
      user,
      assessments,
      dailyTracking,
      reports,
      goals,
      preventiveEvents,
      familyMembers,
      achievements,
      chatMessages
    ] = await Promise.all([
      User.findById(userId).select('-password'),
      Assessment.find({ userId }),
      DailyHealthTracking.find({ userId }).sort({ date: -1 }),
      Report.find({ userId }),
      HealthGoal.find({ userId }),
      PreventiveEvent.find({ userId }),
      FamilyMember.find({ userId }),
      UserAchievement.findOne({ userId }),
      ChatMessage.findOne({ userId })
    ]);

    const exportBundle = {
      exportMetadata: {
        platform: 'GeneGuard AI',
        exportedAt: new Date().toISOString(),
        userIdentifier: user?.email,
        complianceStandard: 'GDPR / HIPAA Data Portability'
      },
      userProfile: user,
      assessments,
      dailyHealthTracking: dailyTracking,
      medicalReports: reports,
      healthGoals: goals,
      preventiveCalendar: preventiveEvents,
      familyHealthHistory: familyMembers,
      achievementsAndStreaks: achievements,
      chatConsultationsSummary: chatMessages ? chatMessages.messages : []
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="geneguard-health-export-${Date.now()}.json"`);
    res.send(JSON.stringify(exportBundle, null, 2));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const exportUserDataCSV = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { type = 'tracking' } = req.query;

    if (type === 'tracking') {
      const logs = await DailyHealthTracking.find({ userId }).sort({ date: -1 });
      const rows = [
        'Date,Water Consumed (L),Water Goal (L),Sleep (hrs),Sleep Goal (hrs),Steps,Walking (mins),Exercise (mins),Exercise Type,Stress Level (1-10),Mood,Fast Food,Sugar Intake',
        ...logs.map(l => [
          l.date,
          l.hydration?.waterConsumed || 0,
          l.hydration?.waterGoal || 2.5,
          l.sleep?.totalSleep || 0,
          l.sleep?.sleepGoal || 8,
          l.physicalActivity?.steps || 0,
          l.physicalActivity?.walkingMinutes || 0,
          l.physicalActivity?.exerciseDuration || 0,
          `"${l.physicalActivity?.exerciseType || 'None'}"`,
          l.wellness?.stressLevel || 5,
          l.wellness?.mood || 'good',
          l.nutrition?.fastFood ? 'Yes' : 'No',
          l.nutrition?.sugarIntake || 'moderate'
        ].join(','))
      ];

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="geneguard-daily-tracking.csv"');
      return res.send(rows.join('\r\n'));
    }

    if (type === 'goals') {
      const goals = await HealthGoal.find({ userId });
      const rows = [
        'Title,Category,Current Progress,Target,Unit,Status,Target Date',
        ...goals.map(g => [
          `"${g.title}"`,
          g.category,
          g.current,
          g.target,
          g.unit,
          g.status,
          new Date(g.targetDate).toLocaleDateString()
        ].join(','))
      ];

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="geneguard-health-goals.csv"');
      return res.send(rows.join('\r\n'));
    }

    res.status(400).json(formatResponse(false, null, 'Invalid export type. Supported: tracking, goals'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

// ==========================================
// 9. Account & Selective Data Deletion
// ==========================================
export const deleteAccount = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json(formatResponse(false, null, 'Password is required to confirm account deletion'));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json(formatResponse(false, null, 'User not found'));

    // Admin safety check
    if (user.email.toLowerCase().trim() === ENV.ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(403).json(formatResponse(false, null, 'The designated primary administrator account cannot be deleted'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json(formatResponse(false, null, 'Incorrect password. Account deletion aborted.'));
    }

    // Clean up uploaded files on disk
    const userReports = await Report.find({ userId });
    for (const rep of userReports) {
      if (rep.filePath && fs.existsSync(rep.filePath)) {
        try {
          fs.unlinkSync(rep.filePath);
        } catch (e) {
          console.warn('File cleanup failed during account deletion:', e);
        }
      }
    }

    // Cascading delete
    await Promise.all([
      User.findByIdAndDelete(userId),
      Assessment.deleteMany({ userId }),
      DailyHealthTracking.deleteMany({ userId }),
      Report.deleteMany({ userId }),
      HealthGoal.deleteMany({ userId }),
      PreventiveEvent.deleteMany({ userId }),
      FamilyMember.deleteMany({ userId }),
      UserAchievement.deleteMany({ userId }),
      ChatMessage.deleteMany({ userId }),
      Notification.deleteMany({ userId })
    ]);

    res.json(formatResponse(true, null, 'Account and all associated health records permanently deleted'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const purgeSelectiveData = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { target } = req.body; // 'chat' | 'tracking' | 'reports' | 'calendar'

    if (target === 'chat') {
      await ChatMessage.deleteMany({ userId });
      return res.json(formatResponse(true, null, 'Chat consultation history cleared'));
    }

    if (target === 'tracking') {
      await DailyHealthTracking.deleteMany({ userId });
      return res.json(formatResponse(true, null, 'Daily health tracking records reset'));
    }

    if (target === 'reports') {
      const reports = await Report.find({ userId });
      for (const r of reports) {
        if (r.filePath && fs.existsSync(r.filePath)) {
          try { fs.unlinkSync(r.filePath); } catch (e) {}
        }
      }
      await Report.deleteMany({ userId });
      return res.json(formatResponse(true, null, 'Uploaded medical reports removed'));
    }

    if (target === 'calendar') {
      await PreventiveEvent.deleteMany({ userId });
      return res.json(formatResponse(true, null, 'Preventive health calendar events cleared'));
    }

    res.status(400).json(formatResponse(false, null, 'Invalid purge target specified'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};