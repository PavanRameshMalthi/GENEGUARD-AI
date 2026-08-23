import api from './api';
import { ApiResponse, AchievementResponse } from '@/types';

export const achievementService = {
  getAchievements: async () => {
    const res = await api.get<ApiResponse<AchievementResponse>>('/achievements');
    return res.data;
  }
};
