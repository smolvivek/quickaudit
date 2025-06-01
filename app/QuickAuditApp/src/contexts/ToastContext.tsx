/**
 * ToastContext
 * Provides toast notification functionality for the app
 */

import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast interface
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Toast context interface
interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
  toasts: Toast[];
}

// Create context with default values
const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  hideToast: () => {},
  toasts: []
});

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Show toast
  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Date.now().toString();
    
    const newToast: Toast = {
      id,
      message,
      type,
      duration
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-hide toast after duration
    setTimeout(() => {
      hideToast(id);
    }, duration);
    
    // Animate toast in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };
  
  // Hide toast
  const hideToast = (id: string) => {
    // Animate toast out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    });
  };
  
  return (
    <ToastContext.Provider
      value={{
        showToast,
        hideToast,
        toasts
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// Hook for using toast context
export const useToast = () => useContext(ToastContext);

export default ToastContext;