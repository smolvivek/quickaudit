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
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { data }: ApiResponse<AuthResponse> = await api.post('/auth/login', credentials);
    await AsyncStorage.setItem('auth_token', data.token);
    return data.user;
  },

  register: async (data: RegisterData): Promise<User> => {
    const { data }: ApiResponse<AuthResponse> = await api.post('/auth/register', data);
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

  resetPassword: async (data: PasswordResetData): Promise<void> => {
    await api.post('/auth/reset-password', data);
  }
};

export const auditApi = {
  createAudit: async (data: Partial<Audit>): Promise<Audit> => {
    const { data }: ApiResponse<Audit> = await api.post('/audits', data);
    return data;
  },

  getAudits: async (filters?: any): Promise<AuditData> => {
    const { data }: ApiResponse<AuditData> = await api.get('/audits', { params: filters });
    return data;
  },

  updateAudit: async (id: number, data: Partial<Audit>): Promise<Audit> => {
    const { data }: ApiResponse<Audit> = await api.put(`/audits/${id}`, data);
    return data;
  },

  deleteAudit: async (id: number): Promise<void> => {
    await api.delete(`/audits/${id}`);
  }
};

export const findingApi = {
  createFinding: async (data: Partial<Finding>): Promise<Finding> => {
    const { data }: ApiResponse<Finding> = await api.post('/findings', data);
    return data;
  },

  getFindings: async (filters?: any): Promise<FindingData> => {
    const { data }: ApiResponse<FindingData> = await api.get('/findings', { params: filters });
    return data;
  },

  updateFinding: async (id: number, data: Partial<Finding>): Promise<Finding> => {
    const { data }: ApiResponse<Finding> = await api.put(`/findings/${id}`, data);
    return data;
  },

  deleteFinding: async (id: number): Promise<void> => {
    await api.delete(`/findings/${id}`);
  }
};
