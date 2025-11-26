import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authApi = {
  register: async (email: string, password: string, passwordConfirm?: string) => {
    const response = await api.post('/api/auth/register', { email, password, passwordConfirm });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  checkSession: async () => {
    const response = await api.get('/api/auth/session');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get(`/api/auth/verify-email?token=${token}`);
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post('/api/auth/resend-verification', { email });
    return response.data;
  },
};

// API Keys API
export const apiKeysApi = {
  getAll: async () => {
    const response = await api.get('/api/keys');
    return response.data;
  },

  save: async (provider: string, apiKey: string) => {
    const response = await api.post('/api/keys', { provider, apiKey });
    return response.data;
  },

  delete: async (provider: string) => {
    const response = await api.delete(`/api/keys/${provider}`);
    return response.data;
  },

  validate: async (provider: string) => {
    const response = await api.get(`/api/keys/${provider}/validate`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
