import api from '../api';

export const identitasSekolahService = {
  get: async () => {
    const response = await api.get('/identitas-sekolah');
    return response.data?.data || response.data;
  },

  update: async (data: any) => {
    const response = await api.put('/identitas-sekolah', data);
    return response.data?.data || response.data;
  }
};
