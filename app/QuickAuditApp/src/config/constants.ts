export const API_URL = 'http://localhost:5000/api';

export const APP_CONFIG = {
  name: 'QuickAudit',
  version: '1.0.0',
  buildNumber: '1',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  LOGIN_FAILED: 'Failed to log in. Please try again.',
  REGISTRATION_FAILED: 'Failed to register. Please try again.',
  LOGOUT_FAILED: 'Failed to log out. Please try again.',
  PASSWORD_RESET_FAILED: 'Failed to reset password. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;
