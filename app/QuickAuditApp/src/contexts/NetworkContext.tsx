/**
 * NetworkContext
 * Provides network connectivity state management for the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// Network context interface
interface NetworkContextType {
  isConnected: boolean;
  connectionType: string | null;
  isInternetReachable: boolean | null;
  checkConnection: () => Promise<boolean>;
}

// Create context with default values
const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  connectionType: null,
  isInternetReachable: null,
  checkConnection: async () => true
});

// Network provider component
export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  
  // Check connection status
  const checkConnection = async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch();
      updateConnectionStatus(state);
      return !!state.isConnected;
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    }
  };
  
  // Update connection status
  const updateConnectionStatus = (state: NetInfoState) => {
    setIsConnected(!!state.isConnected);
    setConnectionType(state.type);
    setIsInternetReachable(state.isInternetReachable);
  };
  
  // Subscribe to network state changes
  useEffect(() => {
    // Initial check
    checkConnection();
    
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(updateConnectionStatus);
    
    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        connectionType,
        isInternetReachable,
        checkConnection
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

// Hook for using network context
export const useNetwork = () => useContext(NetworkContext);

export default NetworkContext;