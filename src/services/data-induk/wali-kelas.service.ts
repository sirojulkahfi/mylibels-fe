/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export interface WaliKelasItem {
  id: string;
  nip: string;
  teacherName: string;
  className: string;
  level: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  studentCount: number;
  phone?: string;
  status: 'Aktif' | 'Non-Aktif';
}

export const waliKelasService = {
  findAll: async () => {
    const response = await api.get('/data-induk/wali-kelas');
    return response.data;
  },
  findOne: async (id: string) => {
    const response = await api.get(`/data-induk/wali-kelas/${id}`);
    return response.data;
  },
  create: async (data: Partial<WaliKelasItem>) => {
    const response = await api.post('/data-induk/wali-kelas', data);
    return response.data;
  },
  update: async (id: string, data: Partial<WaliKelasItem>) => {
    const response = await api.put(`/data-induk/wali-kelas/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/data-induk/wali-kelas/${id}`);
    return response.data;
  },
};
