import api from '../api';

export interface RuanganItem {
  id: string;
  code: string;
  name: string;
  type: string;
  capacity: number;
  condition: string;
}

export const ruanganService = {
  findAll: async () => {
    const response = await api.get('/data-induk/ruangan');
    return response.data;
  },

  findOne: async (id: string) => {
    const response = await api.get(`/data-induk/ruangan/${id}`);
    return response.data;
  },

  create: async (data: Partial<RuanganItem>) => {
    const response = await api.post('/data-induk/ruangan', data);
    return response.data;
  },

  update: async (id: string, data: Partial<RuanganItem>) => {
    const response = await api.patch(`/data-induk/ruangan/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/data-induk/ruangan/${id}`);
    return response.data;
  },
};
