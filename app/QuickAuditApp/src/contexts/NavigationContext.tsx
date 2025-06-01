/**
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

export default NavigationContext;