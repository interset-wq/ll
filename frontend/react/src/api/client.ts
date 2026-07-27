import axios from 'axios';
import type { User, Topic, Entry, PaginatedResponse } from './types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const auth = {
  login: (username: string, password: string) =>
    api.post<User & { token: string }>('/auth/login/', { username, password }),
  register: (username: string, email: string, password: string) =>
    api.post<User & { token: string }>('/auth/register/', { username, email, password }),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get<User>('/auth/me/'),
};

export const topics = {
  list: (page = 1) =>
    api.get<PaginatedResponse<Topic>>('/topics/', { params: { page } }),
  get: (id: number) => api.get<Topic>(`/topics/${id}/`),
  create: (text: string) => api.post<Topic>('/topics/', { text }),
  update: (id: number, text: string) => api.put<Topic>(`/topics/${id}/`, { text }),
  delete: (id: number) => api.delete(`/topics/${id}/`),
};

export const entries = {
  list: (params?: { topic?: number; favorited?: boolean; page?: number }) =>
    api.get<PaginatedResponse<Entry>>('/entries/', { params }),
  get: (id: number) => api.get<Entry>(`/entries/${id}/`),
  create: (data: { title: string; text: string; topic_id: number }) =>
    api.post<Entry>('/entries/', data),
  update: (id: number, data: { title: string; text: string }) =>
    api.put<Entry>(`/entries/${id}/`, data),
  delete: (id: number) => api.delete(`/entries/${id}/`),
  favorite: (id: number) => api.post<{ favorited: boolean }>(`/entries/${id}/favorite/`),
  duplicate: (id: number) => api.post<Entry>(`/entries/${id}/duplicate/`),
};

export default api;
