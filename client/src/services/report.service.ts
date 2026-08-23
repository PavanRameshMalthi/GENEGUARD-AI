import api from './api';
import { Report, ApiResponse, ReportComparisonResult } from '@/types';

export const reportService = {
  uploadReport: async (formData: FormData) => {
    const res = await api.post<ApiResponse<Report>>('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  analyzeReport: async (id: string) => {
    const res = await api.post<ApiResponse<Report>>(`/reports/${id}/analyze`);
    return res.data;
  },

  getReports: async (params?: { search?: string; sort?: 'newest' | 'oldest' }) => {
    const res = await api.get<ApiResponse<Report[]>>('/reports', { params });
    return res.data;
  },

  getReport: async (id: string) => {
    const res = await api.get<ApiResponse<Report>>(`/reports/${id}`);
    return res.data;
  },

  deleteReport: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/reports/${id}`);
    return res.data;
  },

  compareReports: async (reportId1: string, reportId2: string) => {
    const res = await api.post<ApiResponse<ReportComparisonResult>>('/reports/compare', { reportId1, reportId2 });
    return res.data;
  },

  downloadHealthReport: async (assessmentId: string) => {
    const res = await api.get<string>(`/reports/health-report/${assessmentId}`, {
      responseType: 'text'
    });
    return res.data;
  },

  downloadComprehensiveHealthReport: async () => {
    const res = await api.get<string>('/reports/health-summary/pdf', {
      responseType: 'text'
    });
    return res.data;
  }
};
