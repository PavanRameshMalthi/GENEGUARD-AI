import api from './api';
import { DailyTracking, ApiResponse } from '@/types';

export const trackingService = {
  getTrackingHistory: async (params?: { startDate?: string; endDate?: string; limit?: number }) => {
    const res = await api.get<ApiResponse<DailyTracking[]>>('/tracking', { params });
    return res.data;
  },

  getTodayTracking: async () => {
    const res = await api.get<ApiResponse<DailyTracking | null>>('/tracking/today');
    return res.data;
  },

  getTrackingById: async (id: string) => {
    const res = await api.get<ApiResponse<DailyTracking>>(`/tracking/${id}`);
    return res.data;
  },

  saveTracking: async (data: Partial<DailyTracking>) => {
    const res = await api.post<ApiResponse<DailyTracking>>('/tracking', data);
    return res.data;
  },

  deleteTracking: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/tracking/${id}`);
    return res.data;
  }
};
