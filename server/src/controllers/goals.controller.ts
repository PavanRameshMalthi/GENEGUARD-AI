import { Response } from 'express';
import { HealthGoal } from '../models/HealthGoal.js';
import { formatResponse } from '../utils/helpers.js';
import { logTimelineEvent } from '../services/timeline.service.js';
import { createNotification } from '../services/notification.service.js';

export const createGoal = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { title, category, target, current = 0, unit, startDate, targetDate } = req.body;

    const status = Number(current) >= Number(target) ? 'Completed' : 'In Progress';

    const goal = await HealthGoal.create({
      userId,
      title,
      category,
      target,
      current,
      unit,
      startDate: startDate || new Date(),
      targetDate,
      status
    });

    await logTimelineEvent({
      userId,
      eventType: 'goal',
      title: `New Health Goal: ${title}`,
      description: `Target: ${target} ${unit} by ${new Date(targetDate).toLocaleDateString()}.`,
      category: 'goals',
      data: { goalId: goal._id, target, unit, targetDate }
    });

    res.status(201).json(formatResponse(true, goal, 'Goal created successfully'));
  } catch (error: any) {
    console.error('Error creating health goal:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to create health goal'));
  }
};

export const getGoals = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { status, category } = req.query;

    const query: any = { userId };
    if (status) query.status = status;
    if (category) query.category = category;

    const goals = await HealthGoal.find(query).sort({ createdAt: -1 });

    // Auto-update status for overdue goals if still In Progress
    const now = new Date();
    for (const goal of goals) {
      if (goal.status === 'In Progress' && new Date(goal.targetDate) < now) {
        goal.status = 'Overdue';
        await goal.save();
      }
    }

    res.json(formatResponse(true, goals));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getGoalById = async (req: any, res: Response) => {
  try {
    const goal = await HealthGoal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json(formatResponse(false, null, 'Goal not found'));
    res.json(formatResponse(true, goal));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const updateGoal = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { title, category, target, current, unit, targetDate, status } = req.body;

    const goal = await HealthGoal.findOne({ _id: req.params.id, userId });
    if (!goal) return res.status(404).json(formatResponse(false, null, 'Goal not found'));

    if (title !== undefined) goal.title = title;
    if (category !== undefined) goal.category = category;
    if (target !== undefined) goal.target = target;
    if (current !== undefined) goal.current = current;
    if (unit !== undefined) goal.unit = unit;
    if (targetDate !== undefined) goal.targetDate = targetDate;

    // Determine status automatically if progress reaches target
    if (status !== undefined) {
      goal.status = status;
    } else if (goal.current >= goal.target) {
      goal.status = 'Completed';
    } else if (new Date(goal.targetDate) < new Date()) {
      goal.status = 'Overdue';
    } else {
      goal.status = 'In Progress';
    }

    await goal.save();

    if (goal.status === 'Completed') {
      await logTimelineEvent({
        userId,
        eventType: 'goal',
        title: `Goal Completed: ${goal.title}`,
        description: `Successfully reached target of ${goal.target} ${goal.unit}!`,
        category: 'goals',
        data: { goalId: goal._id, target: goal.target, unit: goal.unit }
      });

      await createNotification({
        userId,
        title: 'Goal Completed 🎉',
        message: `Congratulations! You have completed your goal "${goal.title}".`,
        type: 'goal',
        link: '/goals'
      });
    }

    res.json(formatResponse(true, goal, 'Goal updated successfully'));
  } catch (error: any) {
    console.error('Error updating health goal:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to update goal'));
  }
};

export const deleteGoal = async (req: any, res: Response) => {
  try {
    const goal = await HealthGoal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json(formatResponse(false, null, 'Goal not found'));
    res.json(formatResponse(true, null, 'Goal deleted successfully'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};
