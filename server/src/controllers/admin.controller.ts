import { Response } from 'express';
import { User } from '../models/User.js';
import { Assessment } from '../models/Assessment.js';
import { Report } from '../models/Report.js';
import { formatResponse } from '../utils/helpers.js';

export const getStats = async (req: any, res: Response) => {
  try {
    const users = await User.countDocuments();
    const assessments = await Assessment.countDocuments();
    const reports = await Report.countDocuments();
    res.json(formatResponse(true, { users, assessments, reports }));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getUsers = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const users = await User.find().select('-password').skip((page - 1) * limit).limit(limit);
    res.json(formatResponse(true, users));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getAssessments = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const assessments = await Assessment.find().skip((page - 1) * limit).limit(limit);
    res.json(formatResponse(true, assessments));
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