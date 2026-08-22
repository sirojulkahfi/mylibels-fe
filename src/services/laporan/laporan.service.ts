import api from '../api';

export const laporanService = {
  getDashboardSummary: async () => {
    const response = await api.get('/laporan/dashboard');
    return response.data;
  }
};
