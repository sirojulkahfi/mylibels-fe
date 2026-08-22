import api from '../api';

export const presensiService = {
  // Presensi Siswa
  getRekapHarianSiswa: async (tanggal?: string) => {
    const response = await api.get('/presensi/siswa/rekap-harian', { params: { tanggal } });
    return response.data;
  },

  findAllSiswa: async (filters?: any) => {
    const response = await api.get('/presensi/siswa', { params: filters });
    return response.data;
  },

  createSiswa: async (data: any) => {
    const response = await api.post('/presensi/siswa', data);
    return response.data;
  },

  updateSiswa: async (id: string, data: any) => {
    const response = await api.patch(`/presensi/siswa/${id}`, data);
    return response.data;
  },

  deleteSiswa: async (id: string) => {
    const response = await api.delete(`/presensi/siswa/${id}`);
    return response.data;
  },

  // Presensi Guru
  findAllGuru: async (filters?: any) => {
    const response = await api.get('/presensi/guru', { params: filters });
    return response.data;
  },

  createGuru: async (data: any) => {
    const response = await api.post('/presensi/guru', data);
    return response.data;
  },

  updateGuru: async (id: string, data: any) => {
    const response = await api.patch(`/presensi/guru/${id}`, data);
    return response.data;
  },

  deleteGuru: async (id: string) => {
    const response = await api.delete(`/presensi/guru/${id}`);
    return response.data;
  },

  // Perizinan Siswa
  findAllPerizinan: async (filters?: any) => {
    const response = await api.get('/presensi/perizinan', { params: filters });
    return response.data;
  },

  createPerizinan: async (data: any) => {
    const response = await api.post('/presensi/perizinan', data);
    return response.data;
  },

  updatePerizinan: async (id: string, data: any) => {
    const response = await api.patch(`/presensi/perizinan/${id}`, data);
    return response.data;
  },

  deletePerizinan: async (id: string) => {
    const response = await api.delete(`/presensi/perizinan/${id}`);
    return response.data;
  }
};
