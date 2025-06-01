/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import { User, LoginCredentials, RegisterData, UserRole } from '../types/auth';
import { mockBackend } from './mockBackend';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const TOKEN_KEY = 'quickaudit_token';
const USER_KEY = 'quickaudit_user';

class AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;
  
  /**
   * Initialize the auth service
   */
  constructor() {
    this.loadSession();
  }
  
  /**
   * Load user session from storage
   */
  private async loadSession(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userJson = await AsyncStorage.getItem(USER_KEY);
      
      if (token && userJson) {
        this.authToken = token;
        this.currentUser = JSON.parse(userJson);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }
  
  /**
   * Save user session to storage
   */
  private async saveSession(user: User, token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      
      this.currentUser = user;
      this.authToken = token;
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }
  
  /**
   * Clear user session from storage
   */
  private async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      
      this.currentUser = null;
      this.authToken = null;
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
  
  /**
   * Get the current authenticated user
   * @returns Current user or null if not authenticated
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  /**
   * Get the current auth token
   * @returns Auth token or null if not authenticated
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }
  
  /**
   * Check if user is authenticated
   * @returns True if authenticated, false otherwise
   */
  public isAuthenticated(): boolean {
    return !!this.currentUser && !!this.authToken;
  }
  
  /**
   * Login with credentials
   * @param credentials Login credentials
   * @returns Promise resolving to the authenticated user
   */
  public async login(credentials: LoginCredentials): Promise<User> {
    try {
      const { user, token } = await mockBackend.auth.login(
        credentials.email,
        credentials.password
      );
      
      await this.saveSession(user, token);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Register a new user
   * @param data Registration data
   * @returns Promise resolving to the registered user
   */
  public async register(data: RegisterData): Promise<User> {
    try {
      const { user, token } = await mockBackend.auth.register(
        data.name,
        data.email,
        data.password,
        data.organizationName
      );
      
      await this.saveSession(user, token);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  /**
   * Logout the current user
   */
  public async logout(): Promise<void> {
    try {
      await mockBackend.auth.logout();
      await this.clearSession();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
  
  /**
   * Send password reset email
   * @param email User email
   */
  public async forgotPassword(email: string): Promise<void> {
    try {
      await mockBackend.auth.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }
  
  /**
   * Reset password with token
   * @param token Reset token
   * @param newPassword New password
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await mockBackend.auth.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

export default new AuthService();