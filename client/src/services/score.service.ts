import api from './api';
import { DynamicScoreResult, ApiResponse } from '@/types';

export const scoreService = {
  getDynamicScore: async () => {
    const res = await api.get<ApiResponse<DynamicScoreResult>>('/health/score');
    return res.data;
  }
};
