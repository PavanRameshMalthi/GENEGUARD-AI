import api from './api';
import { HealthGoal, ApiResponse } from '@/types';

export const goalService = {
  getGoals: async (params?: { status?: string; category?: string }) => {
    const res = await api.get<ApiResponse<HealthGoal[]>>('/goals', { params });
    return res.data;
  },

  getGoalById: async (id: string) => {
    const res = await api.get<ApiResponse<HealthGoal>>(`/goals/${id}`);
    return res.data;
  },

  createGoal: async (data: Partial<HealthGoal>) => {
    const res = await api.post<ApiResponse<HealthGoal>>('/goals', data);
    return res.data;
  },

  updateGoal: async (id: string, data: Partial<HealthGoal>) => {
    const res = await api.put<ApiResponse<HealthGoal>>(`/goals/${id}`, data);
    return res.data;
  },

  deleteGoal: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/goals/${id}`);
    return res.data;
  }
};
