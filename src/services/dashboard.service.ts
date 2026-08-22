import api from './api';

export const dashboardService = {
  getStats: async (period: string) => {
    const response = await api.get(`/dashboard/stats`, {
      params: { period }
    });
    return response.data;
  }
};
