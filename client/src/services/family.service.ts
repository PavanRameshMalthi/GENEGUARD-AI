import api from './api';
import { ApiResponse, FamilyMember, HereditaryRiskAnalysis } from '@/types';

export const familyService = {
  getFamilyMembers: async () => {
    const res = await api.get<ApiResponse<FamilyMember[]>>('/family');
    return res.data;
  },

  addFamilyMember: async (data: Partial<FamilyMember>) => {
    const res = await api.post<ApiResponse<FamilyMember>>('/family/member', data);
    return res.data;
  },

  updateFamilyMember: async (id: string, data: Partial<FamilyMember>) => {
    const res = await api.put<ApiResponse<FamilyMember>>(`/family/member/${id}`, data);
    return res.data;
  },

  deleteFamilyMember: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/family/member/${id}`);
    return res.data;
  },

  getHereditaryRiskAnalysis: async () => {
    const res = await api.get<ApiResponse<HereditaryRiskAnalysis>>('/family/risk-analysis');
    return res.data;
  }
};
