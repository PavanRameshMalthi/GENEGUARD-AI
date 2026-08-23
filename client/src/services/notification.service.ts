import api from './api';
import { NotificationItem, ApiResponse } from '@/types';

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get<ApiResponse<{ notifications: NotificationItem[]; unreadCount: number }>>('/notifications');
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await api.put<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.put<ApiResponse<null>>('/notifications/read-all');
    return res.data;
  },

  deleteNotification: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
    return res.data;
  }
};
