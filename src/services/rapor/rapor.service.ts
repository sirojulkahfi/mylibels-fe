import api from '../api';

export const raporService = {
  getStatusRapor: async (kelasId: string, semester: string, tahunAjaran: string) => {
    const response = await api.get('/rapor/status', {
      params: { kelasId, semester, tahunAjaran }
    });
    return response.data;
  },

  updateStatusRapor: async (data: any) => {
    const response = await api.post('/rapor/status', data);
    return response.data;
  },

  getValidasiKelengkapan: async (kelasId: string, semester: string, tahunAjaran: string) => {
    const response = await api.get(`/rapor/validasi-kelengkapan/${kelasId}`, {
      params: { semester, tahunAjaran }
    });
    return response.data;
  },

  getSiswaCetakMassal: async (kelasId: string, semester: string, tahunAjaran: string) => {
    const response = await api.get(`/rapor/cetak-massal/${kelasId}`, {
      params: { semester, tahunAjaran }
    });
    return response.data;
  },

  getCatatanKenaikan: async (kelasId: string, semester: string, tahunAjaran: string) => {
    const response = await api.get(`/rapor/catatan-kenaikan/${kelasId}`, {
      params: { semester, tahunAjaran }
    });
    return response.data;
  },

  saveCatatanKenaikan: async (kelasId: string, data: any) => {
    const response = await api.post(`/rapor/catatan-kenaikan/${kelasId}`, data);
    return response.data;
  }
};
