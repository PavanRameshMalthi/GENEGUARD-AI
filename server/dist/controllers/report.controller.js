import { Report } from '../models/Report.js';
import { analyzeReport } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
export const uploadReport = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json(formatResponse(false, null, 'No file uploaded'));
        const report = await Report.create({
            userId: req.user._id,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            filePath: req.file.path
        });
        res.status(201).json(formatResponse(true, report));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const analyzeReportFile = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
        if (!report)
            return res.status(404).json(formatResponse(false, null, 'Report not found'));
        const summary = await analyzeReport(report.fileName, report.fileType);
        report.aiSummary = summary;
        await report.save();
        res.json(formatResponse(true, report));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getReports = async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(formatResponse(true, reports));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getReport = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
        if (!report)
            return res.status(404).json(formatResponse(false, null, 'Report not found'));
        res.json(formatResponse(true, report));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
