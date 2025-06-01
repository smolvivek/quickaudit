import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

// Create axios instance
const api = axios.create({
  baseURL: 'https://api.quickaudit.com/api/v1', // This would be your actual API URL in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async config => {
    try {
      // Get tokens from secure storage
      const credentials = await Keychain.getGenericPassword('auth_tokens');

      if (credentials) {
        const {username: tokens} = credentials;
        const parsedTokens = JSON.parse(tokens);

        if (parsedTokens.accessToken) {
          config.headers.Authorization = `Bearer ${parsedTokens.accessToken}`;
        }
      }

      return config;
    } catch (error) {
      console.error('API request interceptor error:', error);
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const credentials = await Keychain.getGenericPassword('auth_tokens');

        if (credentials) {
          const {username: tokens} = credentials;
          const parsedTokens = JSON.parse(tokens);

          if (parsedTokens.refreshToken) {
            // Call refresh token endpoint
            const response = await axios.post(
              `${api.defaults.baseURL}/auth/refresh-token`,
              {refreshToken: parsedTokens.refreshToken},
            );

            if (response.data.token) {
              // Save new tokens
              await Keychain.setGenericPassword(
                'auth_tokens',
                JSON.stringify({
                  accessToken: response.data.token,
                  refreshToken: response.data.refreshToken,
                }),
                {service: 'auth_tokens'},
              );

              // Update auth header and retry request
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              return api(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Authentication service
export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {email, password});

      return {
        success: true,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Register
  register: async userData => {
    try {
      const response = await api.post('/auth/register', userData);

      return {
        success: true,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Refresh token
  refreshToken: async refreshToken => {
    try {
      const response = await api.post('/auth/refresh-token', {refreshToken});

      return {
        success: true,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Token refresh failed',
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');

      // Clear tokens
      await Keychain.resetGenericPassword({service: 'auth_tokens'});

      return {success: true};
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  },
};

// User service
export const userService = {
  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user data',
      };
    }
  },

  // Update user profile
  updateProfile: async userData => {
    try {
      const response = await api.put('/users/me', userData);

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  },
};

// Audit service
export const auditService = {
  // Get all audits
  getAudits: async (filters = {}) => {
    try {
      const response = await api.get('/audits', {params: filters});

      return {
        success: true,
        audits: response.data.audits,
        pagination: {
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        }
      };
    } catch (error) {
      console.error('Get audits error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get audits',
      };
    }
  },

  // Get audit by ID
  getAuditById: async id => {
    try {
      const response = await api.get(`/audits/${id}`);

      return {
        success: true,
        audit: response.data.audit,
      };
    } catch (error) {
      console.error('Get audit error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get audit',
      };
    }
  },

  // Create audit
  createAudit: async auditData => {
    try {
      const response = await api.post('/audits', auditData);

      return {
        success: true,
        audit: response.data.audit,
      };
    } catch (error) {
      console.error('Create audit error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create audit',
      };
    }
  },

  // Update audit
  updateAudit: async (id, auditData) => {
    try {
      const response = await api.put(`/audits/${id}`, auditData);

      return {
        success: true,
        audit: response.data.audit,
      };
    } catch (error) {
      console.error('Update audit error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update audit',
      };
    }
  },

  // Submit audit for review
  submitAudit: async id => {
    try {
      const response = await api.post(`/audits/${id}/submit`);

      return {
        success: true,
        audit: response.data.audit,
      };
    } catch (error) {
      console.error('Submit audit error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit audit',
      };
    }
  },
};

// Template service
export const templateService = {
  // Get all templates
  getTemplates: async (filters = {}) => {
    try {
      const response = await api.get('/templates', {params: filters});

      return {
        success: true,
        templates: response.data.templates,
      };
    } catch (error) {
      console.error('Get templates error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get templates',
      };
    }
  },

  // Get template by ID
  getTemplateById: async id => {
    try {
      const response = await api.get(`/templates/${id}`);

      return {
        success: true,
        template: response.data.template,
      };
    } catch (error) {
      console.error('Get template error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get template',
      };
    }
  },
};

// Sync service
export const syncService = {
  // Sync data
  syncData: async (isInitialSync = false) => {
    try {
      // Get last sync timestamp
      let lastSyncTimestamp = await AsyncStorage.getItem('lastSyncTimestamp');

      if (!lastSyncTimestamp) {
        lastSyncTimestamp = new Date(0).toISOString(); // Beginning of time if first sync
      }

      // Get pending changes from local database
      // In a real implementation, this would query the local database
      const pendingChanges = {
        audits: [],
        actions: [],
      };

      // Send sync request
      const response = await api.post('/sync', {
        lastSyncTimestamp,
        ...pendingChanges,
      });

      if (response.data) {
        // Update last sync timestamp
        await AsyncStorage.setItem(
          'lastSyncTimestamp',
          response.data.timestamp,

        // Process server changes
        // In a real implementation, this would update the local database

        return {
          success: true,
          timestamp: response.data.timestamp,
          changes: response.data.serverChanges,
        };
      }

      return {
        success: false,
        message: 'No data received from server',
      };
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Sync failed',
      };
    }
  },

  // Get sync status
  getSyncStatus: async () => {
    try {
      const response = await api.get('/sync/status');

      return {
        success: true,
        status: response.data,
      };
    } catch (error) {
      console.error('Get sync status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get sync status',
      };
    }
  },
};

export default api;
