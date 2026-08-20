import api from './api';

export const assessmentService = {
  createAssessment: async (data: any) => {
    const res = await api.post('/assessments', data);
    return res.data;
  },
  getAssessments: async () => {
    const res = await api.get('/assessments');
    return res.data;
  },
  getAssessment: async (id: string) => {
    const res = await api.get(`/assessments/${id}`);
    return res.data;
  }
};
