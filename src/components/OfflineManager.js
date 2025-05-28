import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';

// Import actions
import { setNetworkStatus } from '../redux/slices/networkSlice';
import { syncData } from '../services/syncService';

const OfflineManager = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle');
  const dispatch = useDispatch();

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type
      }));
      
      // Trigger sync when connection is restored
      if (state.isConnected && state.isInternetReachable) {
        triggerSync();
      }
    });

    // Initial setup
    initializeOfflineSupport();

    return () => {
      unsubscribe();
    };
  }, []);

  // Initialize offline support
  const initializeOfflineSupport = async () => {
    try {
      // Check if initial sync has been performed
      const initialSyncDone = await AsyncStorage.getItem('initialSyncDone');
      
      if (!initialSyncDone) {
        // Show first-time sync screen
        setIsLoading(true);
        
        // Perform initial sync
        const networkState = await NetInfo.fetch();
        
        if (networkState.isConnected && networkState.isInternetReachable) {
          await performInitialSync();
        } else {
          // Cannot perform initial sync without connection
          setSyncStatus('offline_first_time');
          setIsLoading(false);
          return;
        }
      } else {
        // Check for pending sync items
        triggerSync();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing offline support:', error);
      setIsLoading(false);
    }
  };

  // Perform initial sync
  const performInitialSync = async () => {
    try {
      setSyncStatus('syncing');
      
      // Fetch all required data for offline use
      await syncData(true);
      
      // Mark initial sync as done
      await AsyncStorage.setItem('initialSyncDone', 'true');
      
      setSyncStatus('synced');
    } catch (error) {
      console.error('Initial sync error:', error);
      setSyncStatus('sync_error');
    }
  };

  // Trigger sync
  const triggerSync = async () => {
    try {
      const networkState = await NetInfo.fetch();
      
      if (!networkState.isConnected || !networkState.isInternetReachable) {
        return;
      }
      
      // Check if there are pending items to sync
      const pendingItems = await checkPendingItems();
      
      if (pendingItems > 0) {
        setSyncStatus('syncing');
        await syncData(false);
        setSyncStatus('synced');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('sync_error');
    }
  };

  // Check for pending items
  const checkPendingItems = async () => {
    // In a real implementation, this would check the local database
    // for items marked with 'pending_sync' status
    return 0;
  };

  // Retry initial sync
  const retryInitialSync = async () => {
    setIsLoading(true);
    await performInitialSync();
    setIsLoading(false);
  };

  // If still loading, show loading screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.text}>Setting up QuickAudit...</Text>
      </View>
    );
  }

  // If offline on first launch, show error
  if (syncStatus === 'offline_first_time') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Internet Connection Required</Text>
        <Text style={styles.text}>
          QuickAudit needs to download initial data before you can use it offline.
          Please connect to the internet and try again.
        </Text>
        <TouchableOpacity style={styles.button} onPress={retryInitialSync}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render children with sync status indicator
  return (
    <View style={styles.wrapper}>
      {children}
      {syncStatus === 'syncing' && (
        <View style={styles.syncIndicator}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.syncText}>Syncing...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  wrapper: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#4b5563',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  syncIndicator: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  syncText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default OfflineManager;
