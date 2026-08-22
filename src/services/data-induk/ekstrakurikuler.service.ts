import api from '../api';

export const ekstrakurikulerService = {
  findAll: async () => {
    const response = await api.get('/data-induk/ekstrakurikuler');
    return response.data;
  },
  findOne: async (id: string) => {
    const response = await api.get(`/data-induk/ekstrakurikuler/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/data-induk/ekstrakurikuler', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/data-induk/ekstrakurikuler/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/data-induk/ekstrakurikuler/${id}`);
    return response.data;
  },
};
