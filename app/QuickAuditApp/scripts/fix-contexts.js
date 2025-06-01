/**
 * Script to fix TypeScript errors in context files
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Fix ThemeContext.tsx
const fixThemeContext = () => {
  const dirPath = path.join(process.cwd(), 'src/contexts');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Theme Context
 * Provides theme functionality throughout the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { appTheme } from '../theme/webAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WhiteLabelConfig from '../features/whitelabel/WhiteLabelConfig';

// Theme mode type
type ThemeMode = 'light' | 'dark' | 'system';

// Theme context interface
interface ThemeContextType {
  theme: typeof appTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: appTheme,
  themeMode: 'system',
  setThemeMode: () => {},
  isDarkMode: false
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference to storage
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('themeMode', themeMode);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [themeMode]);
  
  // Update dark mode based on theme mode and system preference
  useEffect(() => {
    // In a real app, this would check system preference if themeMode is 'system'
    setIsDarkMode(themeMode === 'dark');
  }, [themeMode]);
  
  // Get theme colors from white label config if enabled
  const theme = {
    ...appTheme,
    colors: {
      ...appTheme.colors,
      ...(WhiteLabelConfig.isEnabled() ? WhiteLabelConfig.getThemeColors() : {})
    }
  };
  
  // Set theme mode
  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode: handleSetThemeMode,
        isDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;`;

  fs.writeFileSync(path.join(dirPath, 'ThemeContext.tsx'), content, 'utf8');
  console.log('Fixed ThemeContext.tsx');
};

// Fix SubscriptionContext.tsx
const fixSubscriptionContext = () => {
  const dirPath = path.join(process.cwd(), 'src/contexts');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Subscription Context
 * Provides subscription functionality throughout the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import SubscriptionManager, { 
  SubscriptionTier, 
  SubscriptionPlan, 
  UserSubscription, 
  FeatureFlags 
} from '../features/subscription/SubscriptionManager';

// Subscription context interface
interface SubscriptionContextType {
  currentSubscription: UserSubscription | null;
  currentPlan: SubscriptionPlan | null;
  availablePlans: SubscriptionPlan[];
  upgradeSubscription: (planId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  hasFeature: (featureName: keyof FeatureFlags) => boolean;
  canCreateAudit: (currentAuditCount: number) => boolean;
  canAddUser: (currentUserCount: number) => boolean;
}

// Create context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  currentSubscription: null,
  currentPlan: null,
  availablePlans: [],
  upgradeSubscription: async () => false,
  cancelSubscription: async () => false,
  hasFeature: () => false,
  canCreateAudit: () => false,
  canAddUser: () => false
});

// Subscription provider component
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(
    SubscriptionManager.getCurrentSubscription()
  );
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(
    SubscriptionManager.getCurrentPlan() || null
  );
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>(
    SubscriptionManager.getAvailablePlans()
  );
  
  // Update subscription data when it changes
  useEffect(() => {
    // In a real app, this would subscribe to subscription changes
    const updateSubscription = () => {
      setCurrentSubscription(SubscriptionManager.getCurrentSubscription());
      setCurrentPlan(SubscriptionManager.getCurrentPlan() || null);
    };
    
    // Simulate subscription to changes
    const intervalId = setInterval(updateSubscription, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Upgrade subscription
  const upgradeSubscription = async (planId: string) => {
    const result = await SubscriptionManager.upgradeSubscription(planId);
    
    if (result) {
      setCurrentSubscription(SubscriptionManager.getCurrentSubscription());
      setCurrentPlan(SubscriptionManager.getCurrentPlan() || null);
    }
    
    return result;
  };
  
  // Cancel subscription
  const cancelSubscription = async () => {
    const result = await SubscriptionManager.cancelSubscription();
    
    if (result) {
      setCurrentSubscription(SubscriptionManager.getCurrentSubscription());
    }
    
    return result;
  };
  
  // Check if a feature is available
  const hasFeature = (featureName: keyof FeatureFlags) => {
    return SubscriptionManager.hasFeature(featureName);
  };
  
  // Check if user can create more audits
  const canCreateAudit = (currentAuditCount: number) => {
    return SubscriptionManager.canCreateAudit(currentAuditCount);
  };
  
  // Check if user can add more team members
  const canAddUser = (currentUserCount: number) => {
    return SubscriptionManager.canAddUser(currentUserCount);
  };
  
  return (
    <SubscriptionContext.Provider
      value={{
        currentSubscription,
        currentPlan,
        availablePlans,
        upgradeSubscription,
        cancelSubscription,
        hasFeature,
        canCreateAudit,
        canAddUser
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Hook for using subscription context
export const useSubscription = () => useContext(SubscriptionContext);

export default SubscriptionContext;`;

  fs.writeFileSync(path.join(dirPath, 'SubscriptionContext.tsx'), content, 'utf8');
  console.log('Fixed SubscriptionContext.tsx');
};

// Fix NavigationContext.tsx
const fixNavigationContext = () => {
  const dirPath = path.join(process.cwd(), 'src/contexts');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Navigation Context
 * Provides navigation state and functions throughout the app
 */

import React, { createContext, useState, useContext, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

// Navigation state interface
interface NavigationState {
  currentRoute: string;
  previousRoute: string;
  params: Record<string, any>;
}

// Navigation context interface
interface NavigationContextType {
  navigationRef: React.RefObject<NavigationContainerRef<any>>;
  state: NavigationState;
  navigate: (name: string, params?: Record<string, any>) => void;
  goBack: () => void;
  reset: (name: string, params?: Record<string, any>) => void;
}

// Create context with default values
const NavigationContext = createContext<NavigationContextType>({
  navigationRef: { current: null },
  state: {
    currentRoute: '',
    previousRoute: '',
    params: {}
  },
  navigate: () => {},
  goBack: () => {},
  reset: () => {}
});

// Navigation provider component
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const [state, setState] = useState<NavigationState>({
    currentRoute: '',
    previousRoute: '',
    params: {}
  });
  
  // Navigate to a screen
  const navigate = (name: string, params?: Record<string, any>) => {
    if (navigationRef.current) {
      navigationRef.current.navigate(name as never, params as never);
    }
  };
  
  // Go back to previous screen
  const goBack = () => {
    if (navigationRef.current) {
      navigationRef.current.goBack();
    }
  };
  
  // Reset navigation state
  const reset = (name: string, params?: Record<string, any>) => {
    if (navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name, params }]
      });
    }
  };
  
  // Update navigation state when route changes
  const onStateChange = () => {
    if (navigationRef.current) {
      const route = navigationRef.current.getCurrentRoute();
      if (route) {
        setState(prev => ({
          previousRoute: prev.currentRoute,
          currentRoute: route.name,
          params: route.params || {}
        }));
      }
    }
  };
  
  return (
    <NavigationContext.Provider
      value={{
        navigationRef,
        state,
        navigate,
        goBack,
        reset
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

// Hook for using navigation context
export const useNavigation = () => useContext(NavigationContext);

export default NavigationContext;`;

  fs.writeFileSync(path.join(dirPath, 'NavigationContext.tsx'), content, 'utf8');
  console.log('Fixed NavigationContext.tsx');
};

// Fix ApiIntegration.ts
const fixApiIntegration = () => {
  const dirPath = path.join(process.cwd(), 'src/features/api');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
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
      headers['Authorization'] = \`Bearer \${this.token}\`;
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
        \`\${this.config.baseUrl}\${endpoint}\`,
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
        \`\${this.config.baseUrl}\${endpoint}\`,
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
        \`\${this.config.baseUrl}\${endpoint}\`,
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
        \`\${this.config.baseUrl}\${endpoint}\`,
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

export default new ApiIntegration();`;

  fs.writeFileSync(path.join(dirPath, 'ApiIntegration.ts'), content, 'utf8');
  console.log('Fixed ApiIntegration.ts');
};

// Fix PaymentGateway.ts
const fixPaymentGateway = () => {
  const dirPath = path.join(process.cwd(), 'src/features/payment');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Payment Gateway
 * Handles payment processing through various payment providers
 */

import { Alert } from 'react-native';

// Payment provider types
export type PaymentProvider = 'paypal' | 'razorpay' | 'stripe';

// Payment method interface
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'razorpay';
  details: {
    last4?: string;
    brand?: string;
    expiryMonth?: string;
    expiryYear?: string;
    email?: string;
  };
  isDefault: boolean;
}

// Payment result interface
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Card details interface
export interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

class PaymentGateway {
  private activeProvider: PaymentProvider = 'stripe';
  
  // Set active payment provider
  setProvider(provider: PaymentProvider) {
    this.activeProvider = provider;
  }
  
  // Get active payment provider
  getProvider(): PaymentProvider {
    return this.activeProvider;
  }
  
  // Process payment
  async processPayment(
    amount: number, 
    currency: string = 'USD', 
    paymentMethodId: string,
    description?: string
  ): Promise<PaymentResult> {
    // In a real app, this would call the appropriate payment provider API
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful payment
        resolve({
          success: true,
          transactionId: \`txn_\${Date.now()}\`
        });
      }, 2000);
    });
  }
  
  // Add payment method
  async addPaymentMethod(
    type: 'card' | 'paypal' | 'razorpay',
    details: CardDetails | { email: string }
  ): Promise<PaymentMethod | null> {
    // In a real app, this would call the appropriate payment provider API
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (type === 'card') {
          const cardDetails = details as CardDetails;
          const last4 = cardDetails.number.slice(-4);
          
          resolve({
            id: \`pm_\${Date.now()}\`,
            type: 'card',
            details: {
              last4,
              brand: 'visa', // In a real app, this would be determined by the card number
              expiryMonth: cardDetails.expiry.split('/')[0],
              expiryYear: \`20\${cardDetails.expiry.split('/')[1]}\`
            },
            isDefault: false
          });
        } else if (type === 'paypal') {
          const paypalDetails = details as { email: string };
          
          resolve({
            id: \`pm_\${Date.now()}\`,
            type: 'paypal',
            details: {
              email: paypalDetails.email
            },
            isDefault: false
          });
        } else {
          resolve({
            id: \`pm_\${Date.now()}\`,
            type: 'razorpay',
            details: {},
            isDefault: false
          });
        }
      }, 1500);
    });
  }
  
  // Remove payment method
  async removePaymentMethod(paymentMethodId: string): Promise<boolean> {
    // In a real app, this would call the appropriate payment provider API
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
  
  // Set default payment method
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<boolean> {
    // In a real app, this would call the appropriate payment provider API
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
}

export default new PaymentGateway();`;

  fs.writeFileSync(path.join(dirPath, 'PaymentGateway.ts'), content, 'utf8');
  console.log('Fixed PaymentGateway.ts');
};

// Run the functions
console.log('Fixing context files and API integrations...');
fixThemeContext();
fixSubscriptionContext();
fixNavigationContext();
fixApiIntegration();
fixPaymentGateway();
console.log('Context files and API integrations fixed successfully!');
