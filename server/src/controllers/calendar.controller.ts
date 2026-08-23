import { Response } from 'express';
import { PreventiveEvent } from '../models/PreventiveEvent.js';
import { Assessment } from '../models/Assessment.js';
import { formatResponse } from '../utils/helpers.js';
import { logTimelineEvent } from '../services/timeline.service.js';

export const getEvents = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { status, category, month, year } = req.query;

    const query: any = { userId };
    if (status) query.status = status;
    if (category) query.category = category;

    if (month && year) {
      const padMonth = String(month).padStart(2, '0');
      const start = `${year}-${padMonth}-01`;
      const end = `${year}-${padMonth}-31`;
      query.date = { $gte: start, $lte: end };
    }

    const events = await PreventiveEvent.find(query).sort({ date: 1, time: 1 });

    // Mark overdue events automatically
    const today = new Date().toISOString().split('T')[0];
    for (const ev of events) {
      if (ev.status === 'scheduled' && ev.date < today) {
        ev.status = 'overdue';
        await ev.save();
      }
    }

    res.json(formatResponse(true, events));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const createEvent = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const {
      title,
      category,
      description,
      date,
      time,
      frequency,
      doctorName,
      location,
      notes,
      isAiRecommended,
      riskFactorTag
    } = req.body;

    const event = await PreventiveEvent.create({
      userId,
      title,
      category: category || 'screening',
      description,
      date,
      time: time || '09:00',
      frequency: frequency || 'annual',
      doctorName,
      location,
      notes,
      isAiRecommended: Boolean(isAiRecommended),
      riskFactorTag,
      status: 'scheduled'
    });

    await logTimelineEvent({
      userId,
      eventType: 'assessment',
      title: `Preventive Screening Scheduled: ${title}`,
      description: `Date: ${date} (${category || 'screening'}).`,
      category: 'general',
      data: { eventId: event._id, date, category }
    });

    res.status(201).json(formatResponse(true, event, 'Preventive event scheduled'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const updateEvent = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const event = await PreventiveEvent.findOne({ _id: req.params.id, userId });
    if (!event) return res.status(404).json(formatResponse(false, null, 'Event not found'));

    Object.assign(event, req.body);
    await event.save();

    res.json(formatResponse(true, event, 'Event updated successfully'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const deleteEvent = async (req: any, res: Response) => {
  try {
    const event = await PreventiveEvent.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!event) return res.status(404).json(formatResponse(false, null, 'Event not found'));
    res.json(formatResponse(true, null, 'Event deleted successfully'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getRecommendedScreenings = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    const age = user.profile?.age || 30;
    const gender = user.profile?.gender || 'male';

    const latestAssessment = await Assessment.findOne({ userId }).sort({ createdAt: -1 });

    const recommendations = [
      {
        title: 'Comprehensive Metabolic Panel (CMP) & Lipid Profile',
        category: 'lab_test',
        description: 'Evaluates liver, kidney function, blood glucose, and cardiovascular lipid markers.',
        frequency: 'annual',
        recommendedMonthsAhead: 1,
        riskFactorTag: 'Cardiovascular Baseline',
        reason: 'Recommended for all adults annually to monitor systemic and vascular health.'
      },
      {
        title: 'Preventive Dental Prophylaxis & Oral Cancer Exam',
        category: 'doctor_visit',
        description: 'Bi-annual professional cleaning and gum inflammation check.',
        frequency: 'semi-annual',
        recommendedMonthsAhead: 3,
        riskFactorTag: 'Systemic Inflammation',
        reason: 'Dental hygiene reduces systemic microbial burden and cardiovascular strain.'
      },
      {
        title: 'Comprehensive Eye & Retinal Examination',
        category: 'doctor_visit',
        description: 'Visual acuity, intraocular pressure, and microvascular retinal review.',
        frequency: 'annual',
        recommendedMonthsAhead: 6,
        riskFactorTag: 'Visual Health',
        reason: 'Recommended annually to detect early pressure and microvascular changes.'
      }
    ];

    if (age >= 45) {
      recommendations.push({
        title: 'Colorectal Cancer Screening (FIT Test / Colonoscopy)',
        category: 'screening',
        description: 'Non-invasive stool DNA test or diagnostic colonoscopy.',
        frequency: 'annual',
        recommendedMonthsAhead: 2,
        riskFactorTag: 'Gastrointestinal Screening',
        reason: 'Standard clinical guideline for individuals aged 45 and above.'
      });
    }

    if (gender === 'female' && age >= 40) {
      recommendations.push({
        title: 'Digital Screening Mammogram',
        category: 'screening',
        description: 'Low-dose X-ray imaging for early breast tissue anomaly detection.',
        frequency: 'annual',
        recommendedMonthsAhead: 4,
        riskFactorTag: 'Women’s Health Benchmark',
        reason: 'Standard preventive screening protocol for women aged 40+.'
      });
    }

    if ((latestAssessment?.calculations?.bmi || 0) >= 25 || latestAssessment?.medicalHistory?.diabetes) {
      recommendations.push({
        title: 'Fasting Blood Glucose & HbA1c Glycemic Test',
        category: 'lab_test',
        description: 'Measures 3-month average blood glucose control and insulin resistance.',
        frequency: 'quarterly',
        recommendedMonthsAhead: 1,
        riskFactorTag: 'Glycemic Regulation',
        reason: 'Indicated based on elevated BMI or family/personal metabolic history.'
      });
    }

    res.json(formatResponse(true, recommendations));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const exportICalendar = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const events = await PreventiveEvent.find({ userId, status: { $ne: 'skipped' } });

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GeneGuard AI//Preventive Health Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:GeneGuard Health Calendar',
      'X-WR-TIMEZONE:UTC'
    ];

    for (const ev of events) {
      const cleanDate = ev.date.replace(/-/g, '');
      const cleanTime = (ev.time || '09:00').replace(/:/g, '') + '00';
      const dtStart = `${cleanDate}T${cleanTime}Z`;

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:geneguard-${ev._id}@geneguard.ai`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${dtStart}`,
        `SUMMARY:${ev.title}`,
        `DESCRIPTION:${ev.description || 'GeneGuard AI Preventive Health Event'}\\nDoctor: ${ev.doctorName || 'N/A'}`,
        `LOCATION:${ev.location || 'Medical Center'}`,
        `STATUS:${ev.status === 'completed' ? 'CONFIRMED' : 'TENTATIVE'}`,
        'END:VEVENT'
      );
    }

    icsContent.push('END:VCALENDAR');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="geneguard-preventive-health.ics"');
    res.send(icsContent.join('\r\n'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};
