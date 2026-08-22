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

export default api;
