import api from '../api';

export const tahunAjaranService = {
  findAll: async () => {
    const response = await api.get('/tahun-ajaran');
    return response.data?.data || response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/tahun-ajaran', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/tahun-ajaran/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/tahun-ajaran/${id}`);
    return response.data;
  }
};
