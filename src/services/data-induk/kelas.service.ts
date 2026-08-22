/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export const kelasService = {
  findAll: async () => {
    const response = await api.get('/data-induk/kelas');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/data-induk/kelas', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/data-induk/kelas/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/data-induk/kelas/${id}`);
    return response.data;
  },
};
