import api from './api';

export const recommendationService = {
  getDailyRecommendations: async () => {
    const res = await api.get('/recommendations/daily');
    return res.data;
  },
  getWeeklyGoals: async () => {
    const res = await api.get('/recommendations/weekly-goals');
    return res.data;
  }
};
