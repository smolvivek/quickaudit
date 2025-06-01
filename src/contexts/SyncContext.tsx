import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNetwork } from './NetworkContext';
import { useSettings } from './SettingsContext';
import { useToast } from './ToastContext';
import { useLoading } from './LoadingContext';

interface SyncContextData {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  sync: () => Promise<void>;
  cancelSync: () => void;
}

const SyncContext = createContext<SyncContextData>({} as SyncContextData);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncTimeout, setSyncTimeout] = useState<NodeJS.Timeout | null>(null);

  const { isConnected, isInternetReachable } = useNetwork();
  const { settings } = useSettings();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const sync = useCallback(async () => {
    if (!isConnected || !isInternetReachable) {
      showToast('No internet connection available', 'error');
      return;
    }

    if (isSyncing) {
      showToast('Sync already in progress', 'warning');
      return;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);
      showLoading();

      // TODO: Implement actual sync logic
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated sync

      setLastSyncTime(new Date());
      showToast('Sync completed successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setSyncError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSyncing(false);
      hideLoading();
    }
  }, [
    isConnected,
    isInternetReachable,
    isSyncing,
    showToast,
    showLoading,
    hideLoading,
  ]);

  const cancelSync = useCallback(() => {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
      setSyncTimeout(null);
    }
    setIsSyncing(false);
    showToast('Sync cancelled', 'info');
  }, [syncTimeout, showToast]);

  useEffect(() => {
    if (settings.data.autoSync && isConnected && isInternetReachable) {
      const interval = settings.data.syncInterval * 60 * 1000; // Convert minutes to milliseconds
      const timeout = setTimeout(sync, interval);
      setSyncTimeout(timeout);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [
    settings.data.autoSync,
    settings.data.syncInterval,
    isConnected,
    isInternetReachable,
    sync,
  ]);

  return (
    <SyncContext.Provider
      value={{
        isSyncing,
        lastSyncTime,
        syncError,
        sync,
        cancelSync,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = (): SyncContextData => {
  const context = useContext(SyncContext);

  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }

  return context;
}; 