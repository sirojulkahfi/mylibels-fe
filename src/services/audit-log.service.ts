import api from './api';

export const auditLogService = {
  getAll: async () => {
    const response = await api.get('/audit-log');
    return response.data.data || [];
  },
};
