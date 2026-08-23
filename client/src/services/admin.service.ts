import api from './api';

export const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getUsers: async (page = 1, limit = 20) => {
    const res = await api.get('/admin/users', { params: { page, limit } });
    return res.data;
  },
  deleteUser: async (id: string) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
  getAssessments: async (page = 1, limit = 10) => {
    const res = await api.get('/admin/assessments', { params: { page, limit } });
    return res.data;
  },
  getLogs: async () => {
    const res = await api.get('/admin/logs');
    return res.data;
  }
};
