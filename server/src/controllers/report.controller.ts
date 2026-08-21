import { Response } from 'express';
import { Report } from '../models/Report.js';
import { analyzeReport } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
import { generateHealthReportHTML } from '../utils/report-generator.js';
import { Assessment } from '../models/Assessment.js';

export const generateHealthReport = async (req: any, res: Response) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.assessmentId, userId: req.user._id });
    if (!assessment) return res.status(404).json(formatResponse(false, null, 'Assessment not found'));
    const html = generateHealthReportHTML(assessment);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const uploadReport = async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json(formatResponse(false, null, 'No file uploaded'));
    const report = await Report.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path
    });
    res.status(201).json(formatResponse(true, report));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const analyzeReportFile = async (req: any, res: Response) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json(formatResponse(false, null, 'Report not found'));
    
    const summary = await analyzeReport(report.fileName, report.fileType);
    report.aiSummary = summary;
    await report.save();
    
    res.json(formatResponse(true, report));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getReports = async (req: any, res: Response) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(formatResponse(true, reports));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getReport = async (req: any, res: Response) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json(formatResponse(false, null, 'Report not found'));
    res.json(formatResponse(true, report));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};