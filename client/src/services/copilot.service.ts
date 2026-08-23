import api from './api';
import { ApiResponse, CopilotResponse, CopilotContextSummary } from '@/types';

export const copilotService = {
  chat: async (message: string, chatHistory: any[] = []) => {
    const res = await api.post<ApiResponse<CopilotResponse>>('/copilot/chat', { message, chatHistory });
    return res.data;
  },

  getContextSummary: async () => {
    const res = await api.get<ApiResponse<CopilotContextSummary>>('/copilot/context');
    return res.data;
  }
};
