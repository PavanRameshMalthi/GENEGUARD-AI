import api from './api';

export const reportService = {
  uploadReport: async (formData: FormData) => {
    const res = await api.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  analyzeReport: async (id: string) => {
    const res = await api.post(`/reports/${id}/analyze`);
    return res.data;
  },
  getReports: async () => {
    const res = await api.get('/reports');
    return res.data;
  },
  getReport: async (id: string) => {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  },
  downloadHealthReport: async (assessmentId: string) => {
    const res = await api.get(`/reports/health-report/${assessmentId}`, {
      responseType: 'text'
    });
    return res.data;
  }
};
