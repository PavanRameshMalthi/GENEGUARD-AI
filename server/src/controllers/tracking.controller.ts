import { Response } from 'express';
import { DailyHealthTracking } from '../models/DailyHealthTracking.js';
import { formatResponse } from '../utils/helpers.js';
import { logTimelineEvent } from '../services/timeline.service.js';
import { checkAndGenerateActivityNotifications } from '../services/notification.service.js';

export const upsertDailyTracking = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const {
      date = new Date().toISOString().split('T')[0],
      hydration,
      sleep,
      physicalActivity,
      nutrition,
      wellness
    } = req.body;

    // Calculate remaining water if hydration is supplied
    let hydrationPayload = hydration || {};
    if (hydrationPayload.waterGoal && hydrationPayload.waterConsumed !== undefined) {
      hydrationPayload.remainingWater = Math.max(
        0,
        Number((hydrationPayload.waterGoal - hydrationPayload.waterConsumed).toFixed(1))
      );
    }

    const tracking = await DailyHealthTracking.findOneAndUpdate(
      { userId, date },
      {
        $set: {
          hydration: hydrationPayload,
          sleep: sleep || {},
          physicalActivity: physicalActivity || {},
          nutrition: nutrition || {},
          wellness: wellness || {}
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Log to Timeline
    const water = tracking.hydration?.waterConsumed || 0;
    const sleepHrs = tracking.sleep?.totalSleep || 0;
    const steps = tracking.physicalActivity?.steps || 0;
    const exerciseMins = tracking.physicalActivity?.exerciseDuration || 0;

    await logTimelineEvent({
      userId,
      eventType: 'tracking',
      title: 'Daily Health Tracking Logged',
      description: `Logged metrics for ${date}: ${sleepHrs} hrs sleep, ${water} L water, ${steps.toLocaleString()} steps${exerciseMins > 0 ? `, ${exerciseMins} mins workout` : ''}.`,
      category: 'general',
      data: {
        date,
        waterConsumed: water,
        totalSleep: sleepHrs,
        steps,
        exerciseDuration: exerciseMins,
        stressLevel: tracking.wellness?.stressLevel || 5
      }
    });

    // Check activity notifications
    await checkAndGenerateActivityNotifications(userId);

    res.status(200).json(formatResponse(true, tracking, 'Daily health tracking saved successfully'));
  } catch (error: any) {
    console.error('Error saving daily tracking:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to save daily tracking'));
  }
};

export const getTrackingHistory = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, limit = 30 } = req.query;

    const query: any = { userId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = String(startDate);
      if (endDate) query.date.$lte = String(endDate);
    }

    const trackingList = await DailyHealthTracking.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));

    res.json(formatResponse(true, trackingList));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getTodayTracking = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const tracking = await DailyHealthTracking.findOne({ userId, date: today });
    
    res.json(formatResponse(true, tracking || null));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getTrackingById = async (req: any, res: Response) => {
  try {
    const tracking = await DailyHealthTracking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!tracking) return res.status(404).json(formatResponse(false, null, 'Tracking record not found'));
    res.json(formatResponse(true, tracking));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const deleteTracking = async (req: any, res: Response) => {
  try {
    const tracking = await DailyHealthTracking.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!tracking) return res.status(404).json(formatResponse(false, null, 'Tracking record not found'));
    res.json(formatResponse(true, null, 'Daily tracking record deleted successfully'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};
