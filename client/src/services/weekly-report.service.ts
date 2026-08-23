import api from './api';
import { WeeklyHealthReport, ApiResponse } from '@/types';

export const weeklyReportService = {
  getWeeklyReports: async () => {
    const res = await api.get<ApiResponse<WeeklyHealthReport[]>>('/reports/weekly');
    return res.data;
  },

  getLatestWeeklyReport: async () => {
    const res = await api.get<ApiResponse<WeeklyHealthReport | null>>('/reports/weekly/latest');
    return res.data;
  },

  getWeeklyReportById: async (id: string) => {
    const res = await api.get<ApiResponse<WeeklyHealthReport>>(`/reports/weekly/${id}`);
    return res.data;
  },

  generateWeeklyReport: async (endDate?: string) => {
    const res = await api.post<ApiResponse<WeeklyHealthReport>>('/reports/weekly/generate', { endDate });
    return res.data;
  }
};
