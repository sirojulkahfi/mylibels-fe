import api from '../api';

export const siswaService = {
  findAll: async () => {
    const response = await api.get('/data-induk/siswa');
    return response.data;
  },
  findOne: async (id: string) => {
    const response = await api.get(`/data-induk/siswa/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/data-induk/siswa', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/data-induk/siswa/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/data-induk/siswa/${id}`);
    return response.data;
  },
  bulkUpdateClass: async (studentIds: string[], className: string) => {
    const response = await api.put(`/data-induk/siswa/bulk/class`, { studentIds, className });
    return response.data;
  },
  bulkCreate: async (data: any[]) => {
    const response = await api.post(`/data-induk/siswa/bulk`, data);
    return response.data;
  }
};
