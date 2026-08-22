/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export const mataPelajaranService = {
  findAll: async () => {
    const response = await api.get('/data-induk/mata-pelajaran');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/data-induk/mata-pelajaran', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/data-induk/mata-pelajaran/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/data-induk/mata-pelajaran/${id}`);
    return response.data;
  },
};
