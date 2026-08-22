/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getApprover: async () => {
    const response = await api.get('/users/approver');
    return response.data;
  },
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },
  createRole: async (name: string) => {
    const response = await api.post('/roles', { name });
    return response.data;
  },
  updateRolePermissions: async (id: number, permissions: string[]) => {
    const response = await api.put(`/roles/${id}/permissions`, { permissions });
    return response.data;
  },
  deleteRole: async (id: number) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  bulkUpdateApprover: async (ids: number[], approverId: number | null) => {
    const response = await api.put('/users/bulk/approver', { ids, approverId });
    return response.data;
  },
  
  importExcel: async (data: any[]) => {
    const response = await api.post('/users/import', data);
    return response.data;
  },
  importApprover: async (data: any[]) => {
    const response = await api.post('/users/import-approver', data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
