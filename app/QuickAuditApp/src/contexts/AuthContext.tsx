/**
 * Auth Context
 * Provides authentication functionality throughout the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'auditor' | 'client';
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  forgotPassword: async () => false,
  resetPassword: async () => false
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to get user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API
      // Mock login for demonstration
      if (email && password) {
        const mockUser: User = {
          id: 'user_123',
          email,
          name: email.split('@')[0],
          role: 'auditor'
        };
        
        // Save user data to storage
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };
  
  // Register function
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API
      // Mock registration for demonstration
      if (email && password && name) {
        const mockUser: User = {
          id: `user_${Date.now()}`,
          email,
          name,
          role: 'client'
        };
        
        // Save user data to storage
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      // Mock forgot password for demonstration
      return !!email;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };
  
  // Reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      // Mock reset password for demonstration
      return !!(token && newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;