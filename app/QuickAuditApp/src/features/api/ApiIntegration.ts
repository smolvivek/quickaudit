/**
 * API Integration
 * Handles API requests and responses
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API response interface
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  success: boolean;
}

// API configuration interface
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// Default API configuration
const defaultConfig: ApiConfig = {
  baseUrl: 'https://api.quickaudit.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

class ApiIntegration {
  private config: ApiConfig;
  private token: string | null = null;
  
  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }
  
  // Set authentication token
  setToken(token: string) {
    this.token = token;
  }
  
  // Clear authentication token
  clearToken() {
    this.token = null;
  }
  
  // Get request headers
  private getHeaders(): Record<string, string> {
    const headers = { ...this.config.headers };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }
  
  // Handle API error
  private handleError<T>(error: AxiosError): ApiResponse<T> {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        data: null,
        error: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        success: false
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        data: null,
        error: 'No response received from server',
        status: 0,
        success: false
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        data: null,
        error: error.message || 'An unknown error occurred',
        status: 0,
        success: false
      };
    }
  }
  
  // Make GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        params,
        headers: this.getHeaders(),
        timeout: this.config.timeout
      };
      
      const response: AxiosResponse<T> = await axios.get(
        `${this.config.baseUrl}${endpoint}`,
        config
      );
      
      return {
        data: response.data,
        error: null,
        status: response.status,
        success: true
      };
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }
  
  // Make POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        headers: this.getHeaders(),
        timeout: this.config.timeout
      };
      
      const response: AxiosResponse<T> = await axios.post(
        `${this.config.baseUrl}${endpoint}`,
        data,
        config
      );
      
      return {
        data: response.data,
        error: null,
        status: response.status,
        success: true
      };
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }
  
  // Make PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        headers: this.getHeaders(),
        timeout: this.config.timeout
      };
      
      const response: AxiosResponse<T> = await axios.put(
        `${this.config.baseUrl}${endpoint}`,
        data,
        config
      );
      
      return {
        data: response.data,
        error: null,
        status: response.status,
        success: true
      };
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }
  
  // Make DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        headers: this.getHeaders(),
        timeout: this.config.timeout
      };
      
      const response: AxiosResponse<T> = await axios.delete(
        `${this.config.baseUrl}${endpoint}`,
        config
      );
      
      return {
        data: response.data,
        error: null,
        status: response.status,
        success: true
      };
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }
}

export default new ApiIntegration();