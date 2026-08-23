import { HealthTimeline } from '../models/HealthTimeline.js';
import { Assessment } from '../models/Assessment.js';
import { Report } from '../models/Report.js';
import { formatResponse } from '../utils/helpers.js';
export const getTimelineEvents = async (req, res) => {
    try {
        const userId = req.user._id;
        const { category, limit = 50, page = 1 } = req.query;
        const query = { userId };
        if (category && category !== 'all') {
            if (category === 'exercise') {
                query.category = { $in: ['exercise', 'general'] };
                query.eventType = { $in: ['exercise', 'tracking'] };
            }
            else if (category === 'sleep') {
                query.category = { $in: ['sleep', 'general'] };
                query.eventType = { $in: ['sleep', 'tracking'] };
            }
            else if (category === 'hydration') {
                query.category = { $in: ['hydration', 'general'] };
                query.eventType = { $in: ['hydration', 'tracking'] };
            }
            else {
                query.category = category;
            }
        }
        let events = await HealthTimeline.find(query)
            .sort({ eventDate: -1, createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        // If no timeline events exist yet, check if user has existing assessments or reports to backfill
        if (events.length === 0 && (!category || category === 'all' || category === 'assessments')) {
            const assessments = await Assessment.find({ userId }).sort({ createdAt: -1 });
            for (const a of assessments) {
                await HealthTimeline.create({
                    userId,
                    eventType: 'assessment',
                    title: 'Health Assessment Completed',
                    description: `Health Score: ${a.calculations?.healthScore || 80}/100 • BMI: ${a.calculations?.bmi || 22} (${a.calculations?.bmiCategory || 'Normal'})`,
                    category: 'assessments',
                    data: { assessmentId: a._id, score: a.calculations?.healthScore, bmi: a.calculations?.bmi },
                    eventDate: a.createdAt
                });
            }
            const reports = await Report.find({ userId }).sort({ createdAt: -1 });
            for (const r of reports) {
                await HealthTimeline.create({
                    userId,
                    eventType: 'report',
                    title: `Medical Report Uploaded: ${r.fileName}`,
                    description: `Report Type: ${r.reportType || r.fileType || 'Medical Report'}.`,
                    category: 'reports',
                    data: { reportId: r._id, fileName: r.fileName },
                    eventDate: r.createdAt
                });
            }
            events = await HealthTimeline.find(query)
                .sort({ eventDate: -1, createdAt: -1 })
                .limit(Number(limit));
        }
        const total = await HealthTimeline.countDocuments(query);
        res.json(formatResponse(true, { events, total }));
    }
    catch (error) {
        console.error('Error fetching timeline events:', error);
        res.status(500).json(formatResponse(false, null, error.message));
    }
};
