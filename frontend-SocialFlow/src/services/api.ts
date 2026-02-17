import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; timezone?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: (data: { refreshToken?: string }) =>
    api.post('/auth/logout', data),
  
  logoutAll: () =>
    api.post('/auth/logout-all'),
  
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  updateProfile: (data: Partial<{ firstName: string; lastName: string; avatar: string; timezone: string; language: string; notificationPreferences: any }>) =>
    api.patch('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
  
  forgotPassword: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),
  
  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', data)
};

// Posts API
export const postsAPI = {
  getPosts: (params?: { page?: number; limit?: number; status?: string; platform?: string; search?: string; startDate?: string; endDate?: string }) =>
    api.get('/posts', { params }),
  
  getPost: (id: string) =>
    api.get(`/posts/${id}`),
  
  createPost: (data: any) =>
    api.post('/posts', data),
  
  updatePost: (id: string, data: any) =>
    api.patch(`/posts/${id}`, data),
  
  deletePost: (id: string) =>
    api.delete(`/posts/${id}`),
  
  publishPost: (id: string) =>
    api.post(`/posts/${id}/publish`),
  
  schedulePost: (id: string, data: { scheduledAt: string }) =>
    api.post(`/posts/${id}/schedule`, data),
  
  cancelScheduledPost: (id: string) =>
    api.post(`/posts/${id}/cancel`),
  
  duplicatePost: (id: string) =>
    api.post(`/posts/${id}/duplicate`),
  
  getScheduledPosts: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/posts/scheduled', { params })
};

// Social Accounts API
export const accountsAPI = {
  getAccounts: (params?: { platform?: string; isConnected?: boolean }) =>
    api.get('/accounts', { params }),
  
  getAccount: (id: string) =>
    api.get(`/accounts/${id}`),
  
  connectAccount: (data: any) =>
    api.post('/accounts/connect', data),
  
  disconnectAccount: (id: string) =>
    api.post(`/accounts/${id}/disconnect`),
  
  deleteAccount: (id: string) =>
    api.delete(`/accounts/${id}`),
  
  updateSettings: (id: string, data: { settings: any }) =>
    api.patch(`/accounts/${id}/settings`, data),
  
  refreshToken: (id: string) =>
    api.post(`/accounts/${id}/refresh`),
  
  syncAccount: (id: string) =>
    api.post(`/accounts/${id}/sync`),
  
  getPlatformStats: () =>
    api.get('/accounts/stats')
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/analytics/dashboard', { params }),
  
  getAnalytics: (params?: { platform?: string; startDate?: string; endDate?: string; metric?: string }) =>
    api.get('/analytics', { params }),
  
  getPostAnalytics: (id: string) =>
    api.get(`/analytics/posts/${id}`),
  
  getPlatformAnalytics: (platform: string, params?: { startDate?: string; endDate?: string }) =>
    api.get(`/analytics/platform/${platform}`, { params }),
  
  getBestTimeToPost: (params?: { platform?: string }) =>
    api.get('/analytics/best-time-to-post', { params }),
  
  exportAnalytics: (params?: { format?: 'json' | 'csv'; startDate?: string; endDate?: string }) =>
    api.get('/analytics/export', { params })
};

// Media API
export const mediaAPI = {
  getMedia: (params?: { page?: number; limit?: number; type?: string; folder?: string; search?: string; isUsed?: boolean }) =>
    api.get('/media', { params }),
  
  uploadMedia: (data: FormData) =>
    api.post('/media/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  uploadMultiple: (data: FormData) =>
    api.post('/media/upload-multiple', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  updateMedia: (id: string, data: any) =>
    api.patch(`/media/${id}`, data),
  
  deleteMedia: (id: string) =>
    api.delete(`/media/${id}`),
  
  getFolders: () =>
    api.get('/media/folders'),
  
  createFolder: (data: { name: string }) =>
    api.post('/media/folders', data)
};

export default api;
