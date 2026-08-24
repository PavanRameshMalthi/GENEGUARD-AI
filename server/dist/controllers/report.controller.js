import fs from 'fs';
import path from 'path';
import { Report } from '../models/Report.js';
import { Assessment } from '../models/Assessment.js';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { HealthGoal } from '../models/HealthGoal.js';
import { PreventiveEvent } from '../models/PreventiveEvent.js';
import { FamilyMember } from '../models/FamilyMember.js';
import { analyzeMedicalReport, compareMedicalReports } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
import { generateHealthReportHTML, generateComprehensiveHealthReportHTML } from '../utils/report-generator.js';
import { logTimelineEvent } from '../services/timeline.service.js';
import { createNotification } from '../services/notification.service.js';
export const generateHealthReport = async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ _id: req.params.assessmentId, userId: req.user._id });
        if (!assessment)
            return res.status(404).json(formatResponse(false, null, 'Assessment not found'));
        const html = generateHealthReportHTML(assessment);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getComprehensiveHealthReport = async (req, res) => {
    try {
        const userId = req.user._id;
        const [assessment, trackingHistory, goals, reports, preventiveEvents, familyMembers] = await Promise.all([
            Assessment.findOne({ userId }).sort({ createdAt: -1 }),
            DailyHealthTracking.find({ userId }).sort({ date: -1 }).limit(14),
            HealthGoal.find({ userId }),
            Report.find({ userId }).sort({ createdAt: -1 }),
            PreventiveEvent.find({ userId }).sort({ date: 1 }),
            FamilyMember.find({ userId })
        ]);
        const html = generateComprehensiveHealthReportHTML({
            user: req.user,
            assessment,
            trackingHistory,
            goals,
            reports,
            preventiveEvents,
            familyMembers
        });
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const compareReports = async (req, res) => {
    try {
        const userId = req.user._id;
        const { reportId1, reportId2 } = req.body;
        if (!reportId1 || !reportId2) {
            return res.status(400).json(formatResponse(false, null, 'Two report IDs are required for comparison'));
        }
        const [r1, r2] = await Promise.all([
            Report.findOne({ _id: reportId1, userId }),
            Report.findOne({ _id: reportId2, userId })
        ]);
        if (!r1 || !r2) {
            return res.status(404).json(formatResponse(false, null, 'One or both reports could not be found'));
        }
        // Ensure earlier report is r1, later is r2
        const date1 = new Date(r1.createdAt).getTime();
        const date2 = new Date(r2.createdAt).getTime();
        const earlier = date1 <= date2 ? r1 : r2;
        const later = date1 <= date2 ? r2 : r1;
        const comparison = await compareMedicalReports({
            id: earlier._id.toString(),
            fileName: earlier.fileName,
            date: earlier.createdAt.toISOString(),
            summary: earlier.aiSummary,
            structuredAnalysis: earlier.structuredAnalysis
        }, {
            id: later._id.toString(),
            fileName: later.fileName,
            date: later.createdAt.toISOString(),
            summary: later.aiSummary,
            structuredAnalysis: later.structuredAnalysis
        });
        res.json(formatResponse(true, comparison));
    }
    catch (error) {
        console.error('Report comparison error:', error);
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const uploadReport = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json(formatResponse(false, null, 'No file uploaded'));
        const userId = req.user._id;
        const fileName = req.file.originalname;
        const fileType = req.file.mimetype;
        const filePath = req.file.path;
        const fileSize = req.file.size;
        let reportType = 'General Medical Report';
        const lowerName = fileName.toLowerCase();
        if (lowerName.includes('blood') || lowerName.includes('cbc'))
            reportType = 'Blood Test';
        else if (lowerName.includes('lipid') || lowerName.includes('cholesterol'))
            reportType = 'Lipid Profile';
        else if (lowerName.includes('sugar') || lowerName.includes('glucose') || lowerName.includes('hba1c'))
            reportType = 'Diabetes Panel';
        else if (lowerName.includes('xray') || lowerName.includes('mri') || lowerName.includes('scan') || lowerName.includes('ultrasound'))
            reportType = 'Diagnostic Imaging';
        else if (lowerName.includes('prescription'))
            reportType = 'Prescription';
        const report = await Report.create({
            userId,
            fileName,
            fileType,
            filePath,
            fileSize,
            reportType,
            status: 'pending'
        });
        try {
            const analysisResult = await analyzeMedicalReport(fileName, fileType, filePath);
            report.aiSummary = analysisResult.summary;
            report.structuredAnalysis = analysisResult.structuredAnalysis;
            report.status = 'analyzed';
            await report.save();
        }
        catch (aiErr) {
            console.warn('AI report analysis fallback during upload:', aiErr);
            report.status = 'analyzed';
            await report.save();
        }
        await logTimelineEvent({
            userId,
            eventType: 'report',
            title: `Medical Report Uploaded: ${fileName}`,
            description: `Report Category: ${reportType}. AI structured summary generated.`,
            category: 'reports',
            data: { reportId: report._id, fileName, reportType }
        });
        await createNotification({
            userId,
            title: 'Medical Report Analyzed',
            message: `Your medical report "${fileName}" has been analyzed with educational insights.`,
            type: 'report',
            link: '/reports'
        });
        res.status(201).json(formatResponse(true, report, 'Report uploaded and analyzed successfully'));
    }
    catch (error) {
        console.error('Error uploading report:', error);
        res.status(500).json(formatResponse(false, null, error.message || 'Failed to upload report'));
    }
};
export const analyzeReportFile = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
        if (!report)
            return res.status(404).json(formatResponse(false, null, 'Report not found'));
        const analysisResult = await analyzeMedicalReport(report.fileName, report.fileType, report.filePath);
        report.aiSummary = analysisResult.summary;
        report.structuredAnalysis = analysisResult.structuredAnalysis;
        report.status = 'analyzed';
        await report.save();
        res.json(formatResponse(true, report, 'Report re-analyzed successfully'));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const getReports = async (req, res) => {
    try {
        const userId = req.user._id;
        const { search, sort = 'newest' } = req.query;
        const query = { userId };
        if (search && typeof search === 'string' && search.trim()) {
            query.$or = [
                { fileName: { $regex: search.trim(), $options: 'i' } },
                { reportType: { $regex: search.trim(), $options: 'i' } },
                { 'structuredAnalysis.summary': { $regex: search.trim(), $options: 'i' } }
            ];
        }
        const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
        const reports = await Report.find(query).sort(sortOrder);
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
export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!report)
            return res.status(404).json(formatResponse(false, null, 'Report not found'));
        if (report.filePath && fs.existsSync(report.filePath)) {
            try {
                fs.unlinkSync(report.filePath);
            }
            catch (unlinkErr) {
                console.warn('Could not remove file on disk:', unlinkErr);
            }
        }
        res.json(formatResponse(true, null, 'Report deleted successfully'));
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
export const downloadReportFile = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
        if (!report)
            return res.status(404).json(formatResponse(false, null, 'Report not found'));
        if (!report.filePath || !fs.existsSync(report.filePath)) {
            return res.status(404).json(formatResponse(false, null, 'Report file not found on server'));
        }
        res.download(path.resolve(report.filePath), report.fileName);
    }
    catch (error) {
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
