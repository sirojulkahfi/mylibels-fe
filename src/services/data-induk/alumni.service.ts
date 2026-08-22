/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export const alumniService = {
  findAll: async () => {
    const response = await api.get('/data-induk/alumni');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/data-induk/alumni', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/data-induk/alumni/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/data-induk/alumni/${id}`);
    return response.data;
  },
};
