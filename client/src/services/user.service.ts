import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateProfile: async (data: any) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },

  updateSettings: async (data: any) => {
    const res = await api.put('/users/settings', data);
    return res.data;
  },

  changePassword: async (data: any) => {
    const res = await api.put('/users/password', data);
    return res.data;
  },

  exportDataJSON: async () => {
    const res = await api.get('/users/export-data', { responseType: 'blob' });
    return res.data;
  },

  exportDataCSV: async (type: 'tracking' | 'goals') => {
    const res = await api.get(`/users/export-csv?type=${type}`, { responseType: 'blob' });
    return res.data;
  },

  deleteAccount: async (password: string) => {
    const res = await api.post('/users/delete-account', { password });
    return res.data;
  },

  purgeData: async (target: 'chat' | 'tracking' | 'reports' | 'calendar') => {
    const res = await api.post('/users/purge-data', { target });
    return res.data;
  }
};
