import axios, {AxiosResponse, AxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config/api';

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
  // Add other audit properties here
}

interface Finding {
  id: number;
  // Add other finding properties here
}

interface AuditData {
  // Add audit data properties here
}

interface FindingData {
  // Add finding data properties here
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      AsyncStorage.removeItem('token');
      // Navigate to login screen
      // You'll need to implement this based on your navigation setup
    }
    return Promise.reject(error);
  },
);

// Audit API endpoints
export const auditApi = {
  // Get all audits with optional filters
  getAllAudits: async (params = {}) => {
    try {
      const response = await api.get('/audits', {params});
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get audit by ID
  getAuditById: async id => {
    try {
      const response = await api.get(`/audits/${id}`);
      return response.data.audit;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new audit
  createAudit: async auditData => {
    try {
      const response = await api.post('/audits', auditData);
      return response.data.audit;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update audit
  updateAudit: async (id, auditData) => {
    try {
      const response = await api.put(`/audits/${id}`, auditData);
      return response.data.audit;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete audit
  deleteAudit: async id => {
    try {
      await api.delete(`/audits/${id}`);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update audit status
  updateAuditStatus: async (id, status) => {
    try {
      const response = await api.put(`/audits/${id}/status`, {status});
      return response.data.audit;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Submit audit for review
  submitAudit: async id => {
    try {
      const response = await api.post(`/audits/${id}/submit`);
      return response.data.audit;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Add finding to audit
  addFinding: async (auditId, findingData) => {
    try {
      const response = await api.post(
        `/audits/${auditId}/findings`,
        findingData,
      );
      return response.data.finding;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update finding
  updateFinding: async (auditId, findingId, findingData) => {
    try {
      const response = await api.put(
        `/audits/${auditId}/findings/${findingId}`,
        findingData,
      );
      return response.data.finding;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete finding
  deleteFinding: async (auditId, findingId) => {
    try {
      await api.delete(`/audits/${auditId}/findings/${findingId}`);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Upload photo for finding
  uploadFindingPhoto: async (auditId, findingId, photoUri) => {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await api.post(
        `/audits/${auditId}/findings/${findingId}/photos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data.photoUrl;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Generate PDF report
  generatePdfReport: async id => {
    try {
      const response = await api.get(`/audits/${id}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Helper function to handle API errors
const handleApiError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const {data, status} = error.response;
    return {
      message: data.message || 'An error occurred',
      status,
      errors: data.errors,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'No response from server',
      status: 0,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message,
      status: 0,
    };
  }
};

export default api;
