export type UserRole = 'admin' | 'supervisor' | 'auditor';

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  company?: string;
}

export interface PasswordResetData {
  token: string;
  password: string;
} 