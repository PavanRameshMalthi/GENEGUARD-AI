import api from './api';
import { ApiResponse, PreventiveEvent, RecommendedScreening } from '@/types';

export const calendarService = {
  getEvents: async (params?: { status?: string; category?: string; month?: number; year?: number }) => {
    const res = await api.get<ApiResponse<PreventiveEvent[]>>('/calendar/events', { params });
    return res.data;
  },

  createEvent: async (data: Partial<PreventiveEvent>) => {
    const res = await api.post<ApiResponse<PreventiveEvent>>('/calendar/events', data);
    return res.data;
  },

  updateEvent: async (id: string, data: Partial<PreventiveEvent>) => {
    const res = await api.put<ApiResponse<PreventiveEvent>>(`/calendar/events/${id}`, data);
    return res.data;
  },

  deleteEvent: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/calendar/events/${id}`);
    return res.data;
  },

  getRecommendedScreenings: async () => {
    const res = await api.get<ApiResponse<RecommendedScreening[]>>('/calendar/recommended');
    return res.data;
  },

  downloadICalendarUrl: () => {
    return '/api/calendar/export-ics';
  }
};
