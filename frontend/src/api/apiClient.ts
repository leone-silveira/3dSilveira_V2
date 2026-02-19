import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.url && !config.url.endsWith('/')) {
    config.url += '/';
  }
  return config;
});
