/**
 * Script to fix SyncContext.tsx TypeScript errors
 */

const fs = require('fs');
const path = require('path');

// Fix SyncContext.tsx
const fixSyncContext = () => {
  const filePath = path.join(process.cwd(), 'src/contexts/SyncContext.tsx');
  
  const content = `/**
 * SyncContext
 * Provides data synchronization functionality for the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from './NetworkContext';
import { useAuth } from './AuthContext';

// Sync status type
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

// Sync context interface
interface SyncContextType {
  syncStatus: SyncStatus;
  lastSyncTime: number | null;
  pendingChanges: number;
  syncData: () => Promise<boolean>;
  hasPendingChanges: boolean;
}

// Create context with default values
const SyncContext = createContext<SyncContextType>({
  syncStatus: 'idle',
  lastSyncTime: null,
  pendingChanges: 0,
  syncData: async () => false,
  hasPendingChanges: false
});

// Sync provider component
export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  
  const { isConnected } = useNetwork();
  const { user } = useAuth();
  
  // Load sync info on mount
  useEffect(() => {
    const loadSyncInfo = async () => {
      try {
        const lastSync = await AsyncStorage.getItem('last_sync_time');
        if (lastSync) {
          setLastSyncTime(parseInt(lastSync, 10));
        }
        
        const pendingChangesData = await AsyncStorage.getItem('pending_changes');
        if (pendingChangesData) {
          const changes = JSON.parse(pendingChangesData);
          setPendingChanges(changes.length || 0);
          setHasPendingChanges(changes.length > 0);
        }
      } catch (error) {
        console.error('Failed to load sync info:', error);
      }
    };
    
    loadSyncInfo();
  }, []);
  
  // Auto-sync when connection is restored and there are pending changes
  useEffect(() => {
    if (isConnected && hasPendingChanges && user) {
      syncData();
    }
  }, [isConnected, hasPendingChanges, user]);
  
  // Sync data with server
  const syncData = async (): Promise<boolean> => {
    if (!isConnected || !user) {
      return false;
    }
    
    setSyncStatus('syncing');
    
    try {
      // In a real app, this would call an API to sync data
      // For now, simulate a successful sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update sync info
      const now = Date.now();
      await AsyncStorage.setItem('last_sync_time', now.toString());
      await AsyncStorage.setItem('pending_changes', JSON.stringify([]));
      
      setLastSyncTime(now);
      setPendingChanges(0);
      setHasPendingChanges(false);
      setSyncStatus('success');
      
      return true;
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      return false;
    }
  };
  
  return (
    <SyncContext.Provider
      value={{
        syncStatus,
        lastSyncTime,
        pendingChanges,
        syncData,
        hasPendingChanges
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

// Hook for using sync context
export const useSync = () => useContext(SyncContext);

export default SyncContext;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed SyncContext.tsx');
};

// Run the function
console.log('Fixing SyncContext...');
fixSyncContext();
console.log('SyncContext fixed successfully!');
