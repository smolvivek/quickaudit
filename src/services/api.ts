import axios, { AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiError {
  message: string;
  status: number;
}

interface Audit {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Finding {
  id: number;
  auditId: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AuditData {
  audits: Audit[];
  total: number;
  page: number;
  pageSize: number;
}

interface FindingData {
  findings: Finding[];
  total: number;
  page: number;
  pageSize: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
}

interface PasswordResetData {
  token: string;
  password: string;
}

interface AuditFilters {
  // Add filter properties here
}

interface AuditStatus {
  // Add status properties here
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      AsyncStorage.removeItem('auth_token');
      // Navigate to login screen
      // You'll need to implement this based on your navigation setup
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const { data }: ApiResponse<AuthResponse> = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('auth_token', data.token);
    return data.user;
  },

  register: async (name: string, email: string, password: string, company?: string): Promise<User> => {
    const { data }: ApiResponse<AuthResponse> = await api.post('/auth/register', { name, email, password, company });
    await AsyncStorage.setItem('auth_token', data.token);
    return data.user;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem('auth_token');
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await mockBackend.auth.resetPassword(token, password);
  },

  getCurrentUser: async (): Promise<User> => {
    return mockBackend.auth.getCurrentUser();
  },
};

export const auditApi = {
  getAll: async (page: number, filters: AuditFilters): Promise<AuditResponse> => {
    return mockBackend.audits.getAll(page, filters);
  },

  getById: async (id: string): Promise<Audit> => {
    return mockBackend.audits.getById(id);
  },

  create: async (data: Omit<Audit, 'id' | 'createdAt'>): Promise<Audit> => {
    return mockBackend.audits.create(data);
  },

  update: async (id: string, data: Partial<Omit<Audit, 'id' | 'createdAt'>>): Promise<Audit> => {
    return mockBackend.audits.update(id, data);
  },

  delete: async (id: string): Promise<void> => {
    await mockBackend.audits.delete(id);
  },

  updateStatus: async (id: string, status: AuditStatus): Promise<Audit> => {
    return mockBackend.audits.updateStatus(id, status);
  },

  addFinding: async (auditId: string, data: Omit<Finding, 'id' | 'createdAt' | 'photos'>): Promise<Finding> => {
    return mockBackend.audits.addFinding(auditId, data);
  },

  updateFinding: async (auditId: string, findingId: string, data: Partial<Omit<Finding, 'id' | 'createdAt' | 'photos'>>): Promise<Finding> => {
    return mockBackend.audits.updateFinding(auditId, findingId, data);
  },

  deleteFinding: async (auditId: string, findingId: string): Promise<void> => {
    await mockBackend.audits.deleteFinding(auditId, findingId);
  },

  uploadPhoto: async (auditId: string, findingId: string, photo: any): Promise<{ url: string }> => {
    return mockBackend.audits.uploadPhoto(auditId, findingId, photo);
  },
};

export const handleApiError = (error: any) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  }
  return error.message || 'An error occurred';
};

export default api; 