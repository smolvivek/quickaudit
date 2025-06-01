import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useToast } from './ToastContext';

interface NetworkContextData {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

const NetworkContext = createContext<NetworkContextData>({} as NetworkContextData);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(
    true
  );
  const [type, setType] = useState('unknown');
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable);
      setType(state.type);

      if (!state.isConnected) {
        showToast('No internet connection', 'error');
      } else if (state.isConnected && !state.isInternetReachable) {
        showToast('Internet connection is unstable', 'warning');
      } else if (state.isConnected && state.isInternetReachable) {
        showToast('Back online', 'success');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [showToast]);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isInternetReachable,
        type,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextData => {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }

  return context;
}; 