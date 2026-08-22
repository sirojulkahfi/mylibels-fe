import api from './api';

export const auditLogService = {
  getAll: async () => {
    const response = await api.get('/audit-logs');
    return response.data;
  },
};
