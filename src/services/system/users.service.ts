/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export const usersService = {
  findAll: async () => {
    const response = await api.get('/system-users');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/system-users', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/system-users/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/system-users/${id}`);
    return response.data;
  },
};
