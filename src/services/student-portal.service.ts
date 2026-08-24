import api from './api';

export const studentPortalService = {
  getDashboard: async () => {
    const response = await api.get('/student-portal/dashboard');
    return response.data;
  },

  getJadwal: async () => {
    const response = await api.get('/student-portal/jadwal');
    return response.data;
  },

  getPresensi: async () => {
    const response = await api.get('/student-portal/presensi');
    return response.data;
  },

  getNilai: async (semester?: string) => {
    const params = semester ? { semester } : {};
    const response = await api.get('/student-portal/nilai', { params });
    return response.data;
  },

  getBk: async () => {
    const response = await api.get('/student-portal/bk');
    return response.data;
  },
};
