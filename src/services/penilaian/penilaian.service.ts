import api from '../api';

export const penilaianService = {
  // Nilai Formatif
  findAllFormatif: async (filters?: any) => {
    const response = await api.get('/penilaian/formatif', { params: filters });
    return response.data;
  },
  createFormatif: async (data: any) => {
    const response = await api.post('/penilaian/formatif', data);
    return response.data;
  },
  updateFormatif: async (id: string, data: any) => {
    const response = await api.patch(`/penilaian/formatif/${id}`, data);
    return response.data;
  },

  // Nilai Sumatif
  findAllSumatif: async (filters?: any) => {
    const response = await api.get('/penilaian/sumatif', { params: filters });
    return response.data;
  },
  createSumatif: async (data: any) => {
    const response = await api.post('/penilaian/sumatif', data);
    return response.data;
  },
  updateSumatif: async (id: string, data: any) => {
    const response = await api.patch(`/penilaian/sumatif/${id}`, data);
    return response.data;
  },

  // Penilaian Proyek P5
  findAllProyek: async (filters?: any) => {
    const response = await api.get('/penilaian/proyek', { params: filters });
    return response.data;
  },
  createProyek: async (data: any) => {
    const response = await api.post('/penilaian/proyek', data);
    return response.data;
  },
  updateProyek: async (id: string, data: any) => {
    const response = await api.patch(`/penilaian/proyek/${id}`, data);
    return response.data;
  },

  // Catatan Wali Kelas
  findAllCatatanWK: async (filters?: any) => {
    const response = await api.get('/penilaian/catatan-wk', { params: filters });
    return response.data;
  },
  createCatatanWK: async (data: any) => {
    const response = await api.post('/penilaian/catatan-wk', data);
    return response.data;
  },
  updateCatatanWK: async (id: string, data: any) => {
    const response = await api.patch(`/penilaian/catatan-wk/${id}`, data);
    return response.data;
  }
};
