/**
 * API Service
 * Handles communication with the backend API
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/env';

// Request methods
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

// Request options
export interface RequestOptions extends AxiosRequestConfig {
  authenticated?: boolean;
  retryCount?: number;
  retryDelay?: number;
  cacheResponse?: boolean;
  cacheTTL?: number;
}

// Default options
const DEFAULT_OPTIONS: RequestOptions = {
  authenticated: true,
  retryCount: 3,
  retryDelay: 1000,
  cacheResponse: false,
  cacheTTL: 5 * 60 * 1000 // 5 minutes
};

// Cache storage
interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private cache: Map<string, CacheItem> = new Map();
  
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (config.authenticated !== false) {
          const token = await AsyncStorage.getItem('auth_token');
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && !originalRequest.headers._retry) {
          originalRequest.headers._retry = true;
          try {
            // Refresh token logic would go here
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        
        // Handle retry logic
        if (originalRequest.retryCount && originalRequest.retryCount > 0 && (!error.response || error.response.status >= 500)) {
          originalRequest.retryCount--;
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.axiosInstance(originalRequest));
            }, originalRequest.retryDelay || DEFAULT_OPTIONS.retryDelay);
          });
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Refresh the authentication token
   * @returns Promise resolving to the new token
   */
  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        return null;
      }
      
      // This would be a real API call in a production app
      // For now, just simulate a token refresh
      const newToken = `refreshed_token_${Date.now()}`;
      await AsyncStorage.setItem('auth_token', newToken);
      
      return newToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }
  
  /**
   * Generate a cache key for a request
   * @param method Request method
   * @param url Request URL
   * @param params Request params
   * @param data Request data
   * @returns Cache key
   */
  private generateCacheKey(method: string, url: string, params?: any, data?: any): string {
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }
  
  /**
   * Check if a cached response is valid
   * @param cacheKey Cache key
   * @returns Cached response or null if not valid
   */
  private getCachedResponse(cacheKey: string): any | null {
    const cachedItem = this.cache.get(cacheKey);
    
    if (!cachedItem) {
      return null;
    }
    
    const now = Date.now();
    if (now - cachedItem.timestamp > cachedItem.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cachedItem.data;
  }
  
  /**
   * Cache a response
   * @param cacheKey Cache key
   * @param data Response data
   * @param ttl Cache TTL in milliseconds
   */
  private cacheResponse(cacheKey: string, data: any, ttl: number): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  /**
   * Make an API request
   * @param method Request method
   * @param url Request URL
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  public async request<T = any>(
    method: RequestMethod,
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const mergedOptions: RequestOptions = { ...DEFAULT_OPTIONS, ...options };
    
    // Check cache if enabled
    if (mergedOptions.cacheResponse && method === RequestMethod.GET) {
      const cacheKey = this.generateCacheKey(method, url, mergedOptions.params, mergedOptions.data);
      const cachedResponse = this.getCachedResponse(cacheKey);
      
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request({
        method,
        url,
        ...mergedOptions
      });
      
      // Cache response if enabled
      if (mergedOptions.cacheResponse && method === RequestMethod.GET) {
        const cacheKey = this.generateCacheKey(method, url, mergedOptions.params, mergedOptions.data);
        this.cacheResponse(cacheKey, response.data, mergedOptions.cacheTTL || DEFAULT_OPTIONS.cacheTTL!);
      }
      
      return response.data;
    } catch (error) {
      console.error(`API request error: ${method} ${url}`, error);
      throw error;
    }
  }
  
  /**
   * Make a GET request
   * @param url Request URL
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  public async get<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(RequestMethod.GET, url, options);
  }
  
  /**
   * Make a POST request
   * @param url Request URL
   * @param data Request data
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  public async post<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(RequestMethod.POST, url, { ...options, data });
  }
  
  /**
   * Make a PUT request
   * @param url Request URL
   * @param data Request data
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  public async put<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(RequestMethod.PUT, url, { ...options, data });
  }
  
  /**
   * Make a DELETE request
   * @param url Request URL
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  public async delete<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(RequestMethod.DELETE, url, options);
  }
  
  /**
   * Make a PATCH request
   * @param url Request URL
   * @param data Request data
   * @param options Request options
   * @returns Promise resolving to the response data
   */
  public async patch<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(RequestMethod.PATCH, url, { ...options, data });
  }
  
  /**
   * Clear the response cache
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

export default new ApiService();