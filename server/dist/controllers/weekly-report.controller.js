import { WeeklyHealthReport } from '../models/WeeklyHealthReport.js';
import { generateWeeklyHealthReport } from '../services/weekly-report.service.js';
import { formatResponse } from '../utils/helpers.js';
export const getWeeklyReports = async (req, res) => {
    try {
        const userId = req.user._id;
        const reports = await WeeklyHealthReport.find({ userId }).sort({ weekEndDate: -1 });
        res.json(formatResponse(true, reports));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getLatestWeeklyReport = async (req, res) => {
    try {
        const userId = req.user._id;
        const report = await WeeklyHealthReport.findOne({ userId }).sort({ weekEndDate: -1 });
        res.json(formatResponse(true, report || null));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getWeeklyReportById = async (req, res) => {
    try {
        const report = await WeeklyHealthReport.findOne({ _id: req.params.id, userId: req.user._id });
        if (!report)
            return res.status(404).json(formatResponse(false, null, 'Weekly report not found'));
        res.json(formatResponse(true, report));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const generateWeeklyReport = async (req, res) => {
    try {
        const userId = req.user._id;
        const { endDate } = req.body || {};
        const targetDate = endDate ? new Date(endDate) : new Date();
        const result = await generateWeeklyHealthReport(userId, targetDate);
        if (!result.success) {
            return res.status(400).json(formatResponse(false, null, result.message || 'Unable to generate weekly report'));
        }
        res.status(201).json(formatResponse(true, result.report, 'Weekly health report generated successfully'));
    }
    catch (error) {
        console.error('Error generating weekly report:', error);
        res.status(500).json(formatResponse(false, null, error.message || 'Failed to generate weekly health report'));
    }
};
