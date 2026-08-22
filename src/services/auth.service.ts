/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';

export const authService = {
  login: async (credentials: any) => {
    // Calling the real Next.js API running on port 3001
    const response = await api.post('http://localhost:5000/api/auth/login', credentials);
    return response.data;
  },
};
