import api from '../api';

export const identitasSekolahService = {
  get: async () => {
    const response = await api.get('/system/identitas-sekolah');
    return response.data;
  },

  update: async (data: any) => {
    const response = await api.post('/system/identitas-sekolah', data);
    return response.data;
  }
};
