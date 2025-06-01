/**
 * API Module
 * Provides functions for interacting with the backend API
 */

import ApiService from './ApiService';
import { Audit } from '../types/audit';
import { User, LoginCredentials, RegisterData } from '../types/auth';

// API endpoints
const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User
  CURRENT_USER: '/user/me',
  UPDATE_PROFILE: '/user/profile',
  
  // Audits
  AUDITS: '/audits',
  AUDIT: (id: string) => `/audits/${id}`,
  AUDIT_SECTIONS: (id: string) => `/audits/${id}/sections`,
  AUDIT_ITEMS: (sectionId: string) => `/audits/sections/${sectionId}/items`,
  
  // Photos
  UPLOAD_PHOTO: '/photos/upload',
  PHOTO: (id: string) => `/photos/${id}`
};

/**
 * Authentication API functions
 */
export const authApi = {
  /**
   * Login with credentials
   * @param credentials Login credentials
   * @returns Promise resolving to user and token
   */
  login: async (credentials: LoginCredentials) => {
    return ApiService.post(API_ENDPOINTS.LOGIN, credentials, { authenticated: false });
  },
  
  /**
   * Register a new user
   * @param data Registration data
   * @returns Promise resolving to user and token
   */
  register: async (data: RegisterData) => {
    return ApiService.post(API_ENDPOINTS.REGISTER, data, { authenticated: false });
  },
  
  /**
   * Logout the current user
   */
  logout: async () => {
    return ApiService.post(API_ENDPOINTS.LOGOUT);
  },
  
  /**
   * Get the current user
   * @returns Promise resolving to the current user
   */
  getCurrentUser: async (): Promise<User> => {
    return ApiService.get(API_ENDPOINTS.CURRENT_USER);
  },
  
  /**
   * Send password reset email
   * @param email User email
   */
  forgotPassword: async (email: string) => {
    return ApiService.post(API_ENDPOINTS.FORGOT_PASSWORD, { email }, { authenticated: false });
  },
  
  /**
   * Reset password with token
   * @param token Reset token
   * @param newPassword New password
   */
  resetPassword: async (token: string, newPassword: string) => {
    return ApiService.post(
      API_ENDPOINTS.RESET_PASSWORD,
      { token, newPassword },
      { authenticated: false }
    );
  }
};

/**
 * Audit API functions
 */
export const auditApi = {
  /**
   * Get all audits with pagination
   * @param page Page number
   * @param limit Items per page
   * @returns Promise resolving to paginated audits
   */
  getAll: async (page: number = 1, limit: number = 10) => {
    return ApiService.get(API_ENDPOINTS.AUDITS, {
      params: { page, limit },
      cacheResponse: true
    });
  },
  
  /**
   * Get audit by ID
   * @param id Audit ID
   * @returns Promise resolving to audit
   */
  getById: async (id: string): Promise<Audit> => {
    return ApiService.get(API_ENDPOINTS.AUDIT(id), { cacheResponse: true });
  },
  
  /**
   * Create a new audit
   * @param data Audit data
   * @returns Promise resolving to created audit
   */
  create: async (data: Partial<Audit>): Promise<Audit> => {
    return ApiService.post(API_ENDPOINTS.AUDITS, data);
  },
  
  /**
   * Update an audit
   * @param id Audit ID
   * @param data Audit data
   * @returns Promise resolving to updated audit
   */
  update: async (id: string, data: Partial<Audit>): Promise<Audit> => {
    return ApiService.put(API_ENDPOINTS.AUDIT(id), data);
  },
  
  /**
   * Delete an audit
   * @param id Audit ID
   */
  delete: async (id: string): Promise<void> => {
    return ApiService.delete(API_ENDPOINTS.AUDIT(id));
  },
  
  /**
   * Get audit sections
   * @param auditId Audit ID
   * @returns Promise resolving to audit sections
   */
  getSections: async (auditId: string) => {
    return ApiService.get(API_ENDPOINTS.AUDIT_SECTIONS(auditId), { cacheResponse: true });
  },
  
  /**
   * Get section items
   * @param sectionId Section ID
   * @returns Promise resolving to section items
   */
  getSectionItems: async (sectionId: string) => {
    return ApiService.get(API_ENDPOINTS.AUDIT_ITEMS(sectionId), { cacheResponse: true });
  }
};

/**
 * Photo API functions
 */
export const photoApi = {
  /**
   * Upload a photo
   * @param photoData Photo data
   * @returns Promise resolving to uploaded photo
   */
  upload: async (photoData: FormData) => {
    return ApiService.post(API_ENDPOINTS.UPLOAD_PHOTO, photoData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * Delete a photo
   * @param id Photo ID
   */
  delete: async (id: string): Promise<void> => {
    return ApiService.delete(API_ENDPOINTS.PHOTO(id));
  }
};