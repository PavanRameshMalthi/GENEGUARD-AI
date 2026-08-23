import { Response } from 'express';
import { FamilyMember } from '../models/FamilyMember.js';
import { analyzeFamilyHereditaryRisk } from '../services/gemini.service.js';
import { formatResponse } from '../utils/helpers.js';
import { logTimelineEvent } from '../services/timeline.service.js';

export const getFamilyMembers = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const members = await FamilyMember.find({ userId }).sort({ createdAt: 1 });
    res.json(formatResponse(true, members));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const addFamilyMember = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { relation, name, age, isLiving = true, conditions = [], ageOfOnset, notes } = req.body;

    const member = await FamilyMember.create({
      userId,
      relation,
      name,
      age,
      isLiving: Boolean(isLiving),
      conditions: Array.isArray(conditions) ? conditions : [],
      ageOfOnset,
      notes
    });

    await logTimelineEvent({
      userId,
      eventType: 'assessment',
      title: `Family Health Record Added: ${relation}`,
      description: `Added ${name || relation}${conditions.length ? ` with ${conditions.join(', ')}` : ''}.`,
      category: 'general',
      data: { memberId: member._id, relation, conditions }
    });

    res.status(201).json(formatResponse(true, member, 'Family member record added'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const updateFamilyMember = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const member = await FamilyMember.findOne({ _id: req.params.id, userId });
    if (!member) return res.status(404).json(formatResponse(false, null, 'Family member not found'));

    Object.assign(member, req.body);
    await member.save();

    res.json(formatResponse(true, member, 'Family member updated'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const deleteFamilyMember = async (req: any, res: Response) => {
  try {
    const member = await FamilyMember.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!member) return res.status(404).json(formatResponse(false, null, 'Family member not found'));
    res.json(formatResponse(true, null, 'Family member removed'));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};

export const getHereditaryRiskAnalysis = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const members = await FamilyMember.find({ userId });
    const analysis = await analyzeFamilyHereditaryRisk(members, req.user.profile || {});
    res.json(formatResponse(true, analysis));
  } catch (error: any) {
    res.status(500).json(formatResponse(false, null, error.message));
  }
};
