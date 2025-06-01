import { useState, useCallback } from 'react';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueueLength, setSyncQueueLength] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSyncQueueLength(0);
      setLastSyncTime(Date.now().toString());
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    isOnline,
    isSyncing,
    syncQueueLength,
    lastSyncTime,
    syncNow,
  };
}; 