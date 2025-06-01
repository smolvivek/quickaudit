import {store} from '../redux/store';
import {
  setLastSync,
  incrementPendingSyncCount,
  decrementPendingSyncCount,
} from '../redux/slices/networkSlice';
import {databaseService} from './databaseService';
import {websocketService} from './websocketService';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_QUEUE_KEY = 'sync_queue';
const LAST_SYNC_KEY = 'last_sync_timestamp';

class SyncService {
  constructor() {
    this.syncQueue = [];
    this.isSyncing = false;
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
  }

  async initialize() {
    // Load sync queue from storage
    try {
      const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (queue) {
        this.syncQueue = JSON.parse(queue);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }

    // Set up network listener
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.sync();
      }
    });
  }

  async addToSyncQueue(operation) {
    this.syncQueue.push(operation);
    await this.saveQueue();

    // Try to sync immediately if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      this.sync();
    }
  }

  async sync() {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;
    const operations = [...this.syncQueue];
    this.syncQueue = [];

    for (const operation of operations) {
      let retries = 0;
      let success = false;

      while (retries < this.maxRetries && !success) {
        try {
          await this.processOperation(operation);
          success = true;
          store.dispatch(decrementPendingSyncCount());
        } catch (error) {
          console.error(`Sync error (attempt ${retries + 1}):`, error);
          retries++;
          if (retries < this.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          }
        }
      }

      if (!success) {
        // Add to failed queue
        await this.addToFailedQueue(operation);
      }
    }

    this.isSyncing = false;
    store.dispatch(setLastSync(Date.now().toString()));
  }

  async processOperation(operation) {
    const {type, entity, data} = operation;

    switch (type) {
      case 'create':
        await this.handleCreate(entity, data);
        break;
      case 'update':
        await this.handleUpdate(entity, data);
        break;
      case 'delete':
        await this.handleDelete(entity, data);
        break;
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  async handleCreate(entity, data) {
    // First update local database
    const repository = this.getRepository(entity);
    const localItem = await repository.create({
      ...data,
      syncStatus: 'syncing',
    });

    // Then emit WebSocket event
    websocketService[`emit${entity}Update`](localItem);
  }

  async handleUpdate(entity, data) {
    // First update local database
    const repository = this.getRepository(entity);
    await repository.update(data.id, {
      ...data,
      syncStatus: 'syncing',
    });

    // Then emit WebSocket event
    websocketService[`emit${entity}Update`](data);
  }

  async handleDelete(entity, data) {
    // First update local database
    const repository = this.getRepository(entity);
    await repository.delete(data.id);

    // Then emit WebSocket event
    websocketService[`emit${entity}Update`]({...data, deleted: true});
  }

  getRepository(entity) {
    const repositories = {
      audit: databaseService.auditRepository,
      action: databaseService.actionRepository,
      template: databaseService.templateRepository,
      user: databaseService.userRepository,
    };

    return repositories[entity.toLowerCase()];
  }

  async addToFailedQueue(operation) {
    try {
      const failedQueue = await AsyncStorage.getItem('failedSyncQueue');
      const queue = failedQueue ? JSON.parse(failedQueue) : [];
      queue.push(operation);
      await AsyncStorage.setItem('failedSyncQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to failed queue:', error);
    }
  }

  async saveQueue() {
    try {
      await AsyncStorage.setItem(
        SYNC_QUEUE_KEY,
        JSON.stringify(this.syncQueue),
      );
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  async getLastSyncTimestamp() {
    try {
      return await AsyncStorage.getItem(LAST_SYNC_KEY);
    } catch (error) {
      console.error('Error getting last sync timestamp:', error);
      return null;
    }
  }

  cleanup() {
    NetInfo.removeEventListener();
  }
}

export const syncService = new SyncService();
