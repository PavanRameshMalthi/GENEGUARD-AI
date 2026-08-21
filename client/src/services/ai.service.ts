import api from './api';

export const aiService = {
  analyzeHealth: async (data: any, assessmentId?: string) => {
    const res = await api.post('/ai/analyze', { ...data, assessmentId });
    return res.data;
  },
  chatWithAI: async (message: string, history: any[] = []) => {
    const res = await api.post('/ai/chat', { message, history });
    return res.data;
  }
};

export default aiService;
