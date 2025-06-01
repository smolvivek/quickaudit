/**
 * Auth Types
 * Type definitions for authentication-related data
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  profileImage?: string;
  phone?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  FIELD_AUDITOR = 'field_auditor',
  SUPERVISOR = 'supervisor',
  CLIENT = 'client'
}