import api from './api';

export const chatService = {
  sendMessage: async (message: string) => {
    const res = await api.post('/chat/message', { message });
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get('/chat/history');
    return res.data;
  },
  clearHistory: async () => {
    const res = await api.delete('/chat/history');
    return res.data;
  }
};
