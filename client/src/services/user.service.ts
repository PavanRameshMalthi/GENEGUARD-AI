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
  }
};
