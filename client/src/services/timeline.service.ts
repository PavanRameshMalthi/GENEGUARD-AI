import api from './api';
import { TimelineEvent, ApiResponse } from '@/types';

export const timelineService = {
  getTimelineEvents: async (params?: { category?: string; limit?: number; page?: number }) => {
    const res = await api.get<ApiResponse<{ events: TimelineEvent[]; total: number }>>('/timeline', { params });
    return res.data;
  }
};
