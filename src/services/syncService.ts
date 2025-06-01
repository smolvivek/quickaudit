import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { apiClient } from './api';

interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  timestamp: number;
}

class SyncService {
  private readonly SYNC_QUEUE_KEY = '@QuickAudit:syncQueue';
  private syncInProgress = false;

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp'>) {
    try {
      const queue = await this.getSyncQueue();
      const newItem: SyncQueueItem = {
        ...item,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      };
      queue.push(newItem);
      await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  private async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const queue = await AsyncStorage.getItem(this.SYNC_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error getting sync queue:', error);
      return [];
    }
  }

  private async clearSyncQueue() {
    try {
      await AsyncStorage.removeItem(this.SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Error clearing sync queue:', error);
    }
  }

  async startSync() {
    if (this.syncInProgress) return;

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('No internet connection, sync postponed');
      return;
    }

    this.syncInProgress = true;
    try {
      const queue = await this.getSyncQueue();
      if (queue.length === 0) {
        this.syncInProgress = false;
        return;
      }

      for (const item of queue) {
        try {
          switch (item.type) {
            case 'create':
              await apiClient.post(item.endpoint, item.data);
              break;
            case 'update':
              await apiClient.put(item.endpoint, item.data);
              break;
            case 'delete':
              await apiClient.delete(item.endpoint);
              break;
          }
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error);
          // Keep the item in queue if it failed
          continue;
        }
      }

      // Clear the queue after successful sync
      await this.clearSyncQueue();
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Start periodic sync check
  startPeriodicSync(interval = 5 * 60 * 1000) { // Default: 5 minutes
    setInterval(() => {
      this.startSync();
    }, interval);
  }
}

export const syncService = new SyncService(); 