import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api/v1',
  default: 'http://localhost:8000/api/v1',
});

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

export const auth = {
  login: (username, password) =>
    api.post('/auth/login/', { username, password }),
  register: (username, email, password) =>
    api.post('/auth/register/', { username, email, password }),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
};

export const topics = {
  list: (page = 1) => api.get('/topics/', { params: { page } }),
  get: (id) => api.get(`/topics/${id}/`),
  create: (text) => api.post('/topics/', { text }),
  update: (id, text) => api.put(`/topics/${id}/`, { text }),
  delete: (id) => api.delete(`/topics/${id}/`),
};

export const entries = {
  list: (params) => api.get('/entries/', { params }),
  get: (id) => api.get(`/entries/${id}/`),
  create: (data) => api.post('/entries/', data),
  update: (id, data) => api.put(`/entries/${id}/`, data),
  delete: (id) => api.delete(`/entries/${id}/`),
  favorite: (id) => api.post(`/entries/${id}/favorite/`),
  duplicate: (id) => api.post(`/entries/${id}/duplicate/`),
};

export default api;
