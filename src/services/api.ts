import axios from 'axios';
import Cookies from 'js-cookie';
import { getBaseUrl } from '../utils/api-url';

const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a 401 Unauthorized or a Network Error (server down/restarting)
    const isUnauthorized = error.response?.status === 401;
    const isNetworkError = !error.response && error.message === 'Network Error';
    const isBadGateway = error.response?.status === 502 || error.response?.status === 503;

    if (isUnauthorized || isNetworkError || isBadGateway) {
      // Clear cookies
      Cookies.remove('token');
      Cookies.remove('user');
      
      // Auto logout and redirect to login page if we are not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?session_expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
