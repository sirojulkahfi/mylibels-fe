/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export const guruStafService = {
  findAll: async () => {
    const response = await api.get('/data-induk/guru-staf');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/data-induk/guru-staf', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/data-induk/guru-staf/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/data-induk/guru-staf/${id}`);
    return response.data;
  },
};
