import api from '../api';

export const bkService = {
  // Poin Pelanggaran
  findAllPelanggaran: async (filters?: any) => {
    const response = await api.get('/bk/pelanggaran', { params: filters });
    return response.data;
  },
  createPelanggaran: async (data: any) => {
    const response = await api.post('/bk/pelanggaran', data);
    return response.data;
  },

  // Poin Prestasi
  findAllPrestasi: async (filters?: any) => {
    const response = await api.get('/bk/prestasi', { params: filters });
    return response.data;
  },
  createPrestasi: async (data: any) => {
    const response = await api.post('/bk/prestasi', data);
    return response.data;
  },

  // Bimbingan Konseling
  findAllKonseling: async (filters?: any) => {
    const response = await api.get('/bk/konseling', { params: filters });
    return response.data;
  },
  createKonseling: async (data: any) => {
    const response = await api.post('/bk/konseling', data);
    return response.data;
  }
};
