import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' 
    : 'https://api.quickaudit.com/api',
  TIMEOUT: 30000,
  VERSION: 'v1',
};

// Stripe Configuration
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: Platform.select({
    ios: 'pk_test_your_stripe_publishable_key',
    android: 'pk_test_your_stripe_publishable_key',
  }),
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_OFFLINE_MODE: true,
  ENABLE_PHOTO_CAPTURE: true,
  ENABLE_LOCATION: true,
  ENABLE_AUTO_SYNC: true,
};

// Environment
export const ENV = {
  IS_DEV: __DEV__,
  IS_PROD: !__DEV__,
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
}; 