/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export const settingsService = {
  findAll: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/settings', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/settings/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/settings/${id}`);
    return response.data;
  },
};
