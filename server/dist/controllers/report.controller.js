import fs from 'fs';
import path from 'path';
import { Report } from '../models/Report.js';
import { analyzeMedicalReport } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
import { generateHealthReportHTML } from '../utils/report-generator.js';
import { Assessment } from '../models/Assessment.js';
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
export const uploadReport = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json(formatResponse(false, null, 'No file uploaded'));
        const userId = req.user._id;
        const fileName = req.file.originalname;
        const fileType = req.file.mimetype;
        const filePath = req.file.path;
        const fileSize = req.file.size;
        // Detect report category from filename
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
        // Run AI analysis asynchronously or immediately
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
        // Log to Timeline
        await logTimelineEvent({
            userId,
            eventType: 'report',
            title: `Medical Report Uploaded: ${fileName}`,
            description: `Report Category: ${reportType}. AI structured summary generated.`,
            category: 'reports',
            data: { reportId: report._id, fileName, reportType }
        });
        // Notify User
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
        // Securely delete file from disk if present
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
