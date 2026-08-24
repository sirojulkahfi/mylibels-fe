import api from '../api';

export const akademikService = {
  // Jadwal Pelajaran
  findAllJadwal: async (filters?: any) => {
    const response = await api.get('/akademik/jadwal', { params: filters });
    return response.data;
  },

  getJadwalByKelas: async (kelasId: string) => {
    const response = await api.get(`/akademik/jadwal/kelas/${kelasId}`);
    return response.data;
  },

  getJadwalByGuru: async (guruId: string) => {
    const response = await api.get(`/akademik/jadwal/guru/${guruId}`);
    return response.data;
  },

  createJadwal: async (data: any) => {
    const response = await api.post('/akademik/jadwal', data);
    return response.data;
  },

  generateDummySchedule: async () => {
    const response = await api.post('/akademik/jadwal/generate');
    return response.data;
  },

  updateJadwal: async (id: string, data: any) => {
    const response = await api.patch(`/akademik/jadwal/${id}`, data);
    return response.data;
  },

  deleteJadwal: async (id: string) => {
    const response = await api.delete(`/akademik/jadwal/${id}`);
    return response.data;
  },

  // Capaian Pembelajaran
  findAllCp: async (filters?: any) => {
    const response = await api.get('/akademik/cp', { params: filters });
    return response.data;
  },

  createCp: async (data: any) => {
    const response = await api.post('/akademik/cp', data);
    return response.data;
  },

  updateCp: async (id: string, data: any) => {
    const response = await api.patch(`/akademik/cp/${id}`, data);
    return response.data;
  },

  deleteCp: async (id: string) => {
    const response = await api.delete(`/akademik/cp/${id}`);
    return response.data;
  }
};
