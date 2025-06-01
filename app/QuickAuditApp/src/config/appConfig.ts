export const AppConfig = {
  // App Information
  name: 'QuickAudit',
  version: '1.0.0',

  // Branding
  colors: {
    primary: '#2F80ED',
    secondary: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    danger: '#F44336',
    background: '#FFFFFF',
    text: '#333333',
  },

  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.quickaudit.com',
    timeout: 30000,
  },

  // Feature Flags
  features: {
    darkMode: true,
    notifications: true,
    analytics: true,
    offlineMode: true,
  },

  // Authentication
  auth: {
    tokenExpiration: 3600, // 1 hour
    refreshTokenExpiration: 86400, // 24 hours
  },

  // Storage
  storage: {
    prefix: 'quickaudit_',
  },

  // WebSocket
  websocket: {
    reconnectAttempts: 5,
    reconnectDelay: 1000,
  },

  // Audit Settings
  audit: {
    maxFindings: 50,
    maxAttachments: 10,
    maxAttachmentSize: 5 * 1024 * 1024, // 5MB
  },

  // Subscription Plans
  subscription: {
    trialPeriod: 7, // days
    billingIntervals: ['month', 'year'],
  },
};
