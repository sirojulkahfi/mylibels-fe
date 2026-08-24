import api from './api';

export interface PengumumanData {
  id?: string;
  title: string;
  content: string;
  category: string;
  authorId?: string;
  author?: {
    name: string;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const pengumumanService = {
  getAll: async () => {
    const response = await api.get('/pengumuman');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/pengumuman/${id}`);
    return response.data;
  },

  create: async (data: PengumumanData) => {
    const response = await api.post('/pengumuman', data);
    return response.data;
  },

  update: async (id: string, data: Partial<PengumumanData>) => {
    const response = await api.put(`/pengumuman/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/pengumuman/${id}`);
    return response.data;
  },
};
