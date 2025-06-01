import {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {syncService} from '../services/syncService';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueueLength, setSyncQueueLength] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Initialize sync service
    syncService.initialize();

    // Set up network listener
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        syncService.sync();
      }
    });

    // Set up sync status listener
    const syncInterval = setInterval(async () => {
      const queue = await AsyncStorage.getItem('sync_queue');
      setSyncQueueLength(queue ? JSON.parse(queue).length : 0);
      setLastSyncTime(await syncService.getLastSyncTimestamp());
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(syncInterval);
      syncService.cleanup();
    };
  }, []);

  const syncNow = async () => {
    if (!isOnline) {
      return;
    }

    setIsSyncing(true);
    try {
      await syncService.sync();
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    syncQueueLength,
    lastSyncTime,
    syncNow,
  };
};
