/**
 * Environment Configuration
 * Contains environment-specific configuration values
 * 
 * IMPORTANT: This file should be gitignored in a real production environment
 * Sensitive values should be loaded from a secure storage or environment variables
 */

// Payment Gateway Configuration
export const PAYMENT_CONFIG = {
  paypal: {
    clientId: 'AUUDtpE310Akz52uQx5U6EnK3FmXT2ww7iWszeTZ_b3GwwAF8Ii5FivyIjFZmOe1pAgFw9Lk08QfbbtG',
    // In a real app, this would be stored securely and not in the code
    // For development purposes only
    clientSecret: 'EPa8SyisWPcv1eCbsOIpl_ZLl1sGqpY9pWW5-tkvnLEdcAMbyX7ySmmWOQKHiHNHmPqpBS7F26nqMWh9',
    environment: 'sandbox', // 'sandbox' or 'production'
    merchantId: 'quickaudit-merchant',
  },
  razorpay: {
    keyId: 'rzp_test_YfuuR9BOe3ZWsB',
    keySecret: 'yoursecrethere', // This should be stored securely
    environment: 'sandbox',
  }
};

// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://api.quickaudit.com',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableAnalytics: true,
  enableCrashReporting: true,
};
