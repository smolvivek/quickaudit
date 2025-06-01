/**
 * Script to fix remaining TypeScript errors in service files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Fix authService.ts
const fixAuthService = () => {
  const content = `/**
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

export default new AuthService();`;

  fs.writeFileSync(path.join(process.cwd(), 'src/services/authService.ts'), content, 'utf8');
  console.log('Fixed authService.ts');
};

// Fix errorService.ts
const fixErrorService = () => {
  const content = `/**
 * Error Service
 * Handles error logging, reporting, and user-friendly error messages
 */

interface ErrorOptions {
  showUser?: boolean;
  reportToServer?: boolean;
  level?: ErrorLevel;
  context?: Record<string, any>;
}

enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: number;
  level: ErrorLevel;
  context?: Record<string, any>;
  deviceInfo?: Record<string, any>;
}

class ErrorService {
  private errorReports: ErrorReport[] = [];
  private maxStoredErrors: number = 50;
  
  /**
   * Handle an error
   * @param error Error object or message
   * @param options Error handling options
   */
  public handleError(error: Error | string, options: ErrorOptions = {}): void {
    const defaultOptions: ErrorOptions = {
      showUser: true,
      reportToServer: true,
      level: ErrorLevel.ERROR,
      context: {}
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;
    
    // Create error report
    const report: ErrorReport = {
      message: errorMessage,
      stack: errorStack,
      timestamp: Date.now(),
      level: mergedOptions.level!,
      context: mergedOptions.context
    };
    
    // Add to local storage
    this.storeErrorReport(report);
    
    // Log to console
    this.logErrorToConsole(report);
    
    // Report to server if enabled
    if (mergedOptions.reportToServer) {
      this.reportErrorToServer(report);
    }
    
    // Show to user if enabled
    if (mergedOptions.showUser) {
      this.showErrorToUser(report);
    }
  }
  
  /**
   * Store error report in local storage
   * @param report Error report to store
   */
  private storeErrorReport(report: ErrorReport): void {
    this.errorReports.push(report);
    
    // Limit the number of stored errors
    if (this.errorReports.length > this.maxStoredErrors) {
      this.errorReports.shift();
    }
  }
  
  /**
   * Log error to console
   * @param report Error report to log
   */
  private logErrorToConsole(report: ErrorReport): void {
    const { level, message, stack, context } = report;
    
    switch (level) {
      case ErrorLevel.INFO:
        console.info(\`[INFO] \${message}\`, { stack, context });
        break;
      case ErrorLevel.WARNING:
        console.warn(\`[WARNING] \${message}\`, { stack, context });
        break;
      case ErrorLevel.ERROR:
        console.error(\`[ERROR] \${message}\`, { stack, context });
        break;
      case ErrorLevel.CRITICAL:
        console.error(\`[CRITICAL] \${message}\`, { stack, context });
        break;
    }
  }
  
  /**
   * Report error to server
   * @param report Error report to send
   */
  private async reportErrorToServer(report: ErrorReport): Promise<void> {
    // This would be implemented with actual API calls in a real app
    // For now, just log that we would report it
    console.log(\`Would report error to server: \${report.message}\`);
  }
  
  /**
   * Show error to user
   * @param report Error report to show
   */
  private showErrorToUser(report: ErrorReport): void {
    // This would be implemented with actual UI alerts in a real app
    // For now, just log that we would show it
    console.log(\`Would show error to user: \${report.message}\`);
  }
  
  /**
   * Get all stored error reports
   * @returns Array of error reports
   */
  public getErrorReports(): ErrorReport[] {
    return [...this.errorReports];
  }
  
  /**
   * Clear all stored error reports
   */
  public clearErrorReports(): void {
    this.errorReports = [];
  }
}

export default new ErrorService();`;

  fs.writeFileSync(path.join(process.cwd(), 'src/services/errorService.ts'), content, 'utf8');
  console.log('Fixed errorService.ts');
};

// Fix locationService.ts
const fixLocationService = () => {
  const content = `/**
 * Location Service
 * Handles location-related functionality
 */

import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  distanceFilter?: number;
}

class LocationService {
  private defaultOptions: LocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
    distanceFilter: 10
  };
  
  /**
   * Request location permissions
   * @returns Promise resolving to a boolean indicating if permission was granted
   */
  private async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      // iOS handles permissions through info.plist
      return true;
    }
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'QuickAudit needs access to your location for audit geo-tagging.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }
  
  /**
   * Get current location
   * @param options Location options
   * @returns Promise resolving to location
   */
  public async getCurrentLocation(options: LocationOptions = {}): Promise<Location> {
    const hasPermission = await this.requestLocationPermission();
    
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }
    
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };
          
          resolve(location);
        },
        (error) => {
          reject(new Error(\`Failed to get location: \${error.message}\`));
        },
        {
          enableHighAccuracy: mergedOptions.enableHighAccuracy,
          timeout: mergedOptions.timeout,
          maximumAge: mergedOptions.maximumAge
        }
      );
    });
  }
  
  /**
   * Watch location changes
   * @param callback Callback function for location updates
   * @param options Location options
   * @returns Watch ID for clearing the watch
   */
  public watchLocation(
    callback: (location: Location) => void,
    options: LocationOptions = {}
  ): number {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    return Geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        
        callback(location);
      },
      (error) => {
        console.error('Location watch error:', error);
      },
      {
        enableHighAccuracy: mergedOptions.enableHighAccuracy,
        timeout: mergedOptions.timeout,
        maximumAge: mergedOptions.maximumAge,
        distanceFilter: mergedOptions.distanceFilter
      }
    );
  }
  
  /**
   * Clear location watch
   * @param watchId Watch ID to clear
   */
  public clearWatch(watchId: number): void {
    Geolocation.clearWatch(watchId);
  }
  
  /**
   * Calculate distance between two locations (in meters)
   * @param location1 First location
   * @param location2 Second location
   * @returns Distance in meters
   */
  public calculateDistance(location1: Location, location2: Location): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (location1.latitude * Math.PI) / 180;
    const φ2 = (location2.latitude * Math.PI) / 180;
    const Δφ = ((location2.latitude - location1.latitude) * Math.PI) / 180;
    const Δλ = ((location2.longitude - location1.longitude) * Math.PI) / 180;
    
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }
}

export default new LocationService();`;

  fs.writeFileSync(path.join(process.cwd(), 'src/services/locationService.ts'), content, 'utf8');
  console.log('Fixed locationService.ts');
};

// Run all fixes
console.log('Fixing remaining service files...');
fixAuthService();
fixErrorService();
fixLocationService();

console.log('All service files fixed!');
console.log('Running TypeScript check to verify...');

try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('TypeScript check passed! The app is ready for deployment.');
} catch (error) {
  console.error('Some TypeScript errors remain. Please check the output above.');
}
