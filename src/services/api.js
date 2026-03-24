import axios from 'axios';

// 统一使用 model_api 作为后端前缀
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deepseek.club/model_api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 模型相关API
export const modelAPI = {
  getAll: (params) => api.get('/models', { params }),
  getById: (id) => api.get(`/models/${id}`),
  like: (id) => api.post(`/models/${id}/like`),
  download: (id) => api.post(`/models/${id}/download`),
};

// 基座模型相关API
export const baseModelAPI = {
  getAll: (params) => api.get('/base-models', { params }),
};

// 应用相关API
export const appAPI = {
  getAll: (params) => api.get('/apps', { params }),
  getById: (id) => api.get(`/apps/${id}`),
  upvote: (id) => api.post(`/apps/${id}/upvote`),
};

// 活动相关API
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  submit: (data) => api.post('/events/submit', data),
  like: (id) => api.post(`/events/${id}/like`),
  register: (id, data) => api.post(`/events/${id}/register`, data),
};

// 项目相关API
export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  submit: (data) => api.post('/projects/submit', data),
  like: (id) => api.post(`/projects/${id}/like`),
};

// 通用API
export const commonAPI = {
  getCategories: (type) => api.get('/categories', { params: { type } }),
  getTags: () => api.get('/tags'),
  getStats: () => api.get('/stats'),
};

export default api;
