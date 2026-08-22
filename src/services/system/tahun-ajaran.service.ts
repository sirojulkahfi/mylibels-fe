import api from '../api';

export const tahunAjaranService = {
  findAll: async () => {
    const response = await api.get('/system/tahun-ajaran');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/system/tahun-ajaran', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/system/tahun-ajaran/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/system/tahun-ajaran/${id}`);
    return response.data;
  }
};
