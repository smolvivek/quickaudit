import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from './ToastContext';
import { useLoading } from './LoadingContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supervisor' | 'auditor' | 'client';
  organizationId?: string;
  teamId?: string;
  permissions?: string[];
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@QuickAudit:user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load stored user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (!user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        showLoading();
        // TODO: Implement actual API call
        const response = await fetch('YOUR_API_URL/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        const { token, user: userData } = data;

        // Store token and user data
        await AsyncStorage.setItem('@QuickAudit:token', token);
        await AsyncStorage.setItem('@QuickAudit:user', JSON.stringify(userData));

        setUser(userData);
        showToast('Successfully logged in!', 'success');
      } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
      } finally {
        hideLoading();
      }
    },
    [showToast, showLoading, hideLoading]
  );

  const signOut = useCallback(async () => {
    try {
      showLoading();
      // TODO: Implement actual API call
      await AsyncStorage.removeItem('@QuickAudit:token');
      await AsyncStorage.removeItem('@QuickAudit:user');
      setUser(null);
      showToast('Successfully logged out!', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Logout failed. Please try again.', 'error');
    } finally {
      hideLoading();
    }
  }, [showToast, showLoading, hideLoading]);

  const updateUser = useCallback(
    async (updatedUser: User) => {
      try {
        showLoading();
        // TODO: Implement actual API call
        await AsyncStorage.setItem('@QuickAudit:user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showToast('User updated successfully!', 'success');
      } catch (error) {
        console.error('Update user error:', error);
        showToast('Failed to update user. Please try again.', 'error');
      } finally {
        hideLoading();
      }
    },
    [showToast, showLoading, hideLoading]
  );

  const value: AuthContextData = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    updateUser,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};