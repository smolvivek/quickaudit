/**
 * Sync Service
 * Handles data synchronization between the app and the server
 */

import { Audit } from '../types/audit';
import { User } from '../types/auth';

export interface SyncOptions {
  forceSync?: boolean;
  syncPhotos?: boolean;
  syncAudits?: boolean;
  syncUsers?: boolean;
  syncInterval?: number;
}

export interface SyncResult {
  success: boolean;
  timestamp: number;
  syncedItems: {
    audits: number;
    photos: number;
    users: number;
  };
  errors?: string[];
}

class SyncService {
  private lastSyncTimestamp: number = 0;
  private isSyncing: boolean = false;
  private syncQueue: Array<() => Promise<void>> = [];
  private defaultOptions: SyncOptions = {
    forceSync: false,
    syncPhotos: true,
    syncAudits: true,
    syncUsers: true,
    syncInterval: 15 * 60 * 1000 // 15 minutes
  };
  
  /**
   * Sync data with the server
   * @param options Sync options
   * @returns Promise resolving to sync result
   */
  public async sync(options: SyncOptions = {}): Promise<SyncResult> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // Check if sync is needed based on interval
    if (!mergedOptions.forceSync && 
        Date.now() - this.lastSyncTimestamp < mergedOptions.syncInterval!) {
      return {
        success: true,
        timestamp: this.lastSyncTimestamp,
        syncedItems: { audits: 0, photos: 0, users: 0 }
      };
    }
    
    // If already syncing, return a promise that will resolve when current sync is done
    if (this.isSyncing) {
      return new Promise((resolve) => {
        this.syncQueue.push(async () => {
          const result = await this.performSync(mergedOptions);
          resolve(result);
        });
      });
    }
    
    return this.performSync(mergedOptions);
  }
  
  /**
   * Perform the actual sync operation
   * @param options Sync options
   * @returns Promise resolving to sync result
   */
  private async performSync(options: SyncOptions): Promise<SyncResult> {
    this.isSyncing = true;
    const result: SyncResult = {
      success: true,
      timestamp: Date.now(),
      syncedItems: {
        audits: 0,
        photos: 0,
        users: 0
      },
      errors: []
    };
    
    try {
      // Sync audits if enabled
      if (options.syncAudits) {
        try {
          const syncedAudits = await this.syncAudits();
          result.syncedItems.audits = syncedAudits.length;
        } catch (error) {
          result.errors!.push(`Audit sync error: ${error}`);
          result.success = false;
        }
      }
      
      // Sync photos if enabled
      if (options.syncPhotos) {
        try {
          const syncedPhotos = await this.syncPhotos();
          result.syncedItems.photos = syncedPhotos.length;
        } catch (error) {
          result.errors!.push(`Photo sync error: ${error}`);
          result.success = false;
        }
      }
      
      // Sync users if enabled
      if (options.syncUsers) {
        try {
          const syncedUsers = await this.syncUsers();
          result.syncedItems.users = syncedUsers.length;
        } catch (error) {
          result.errors!.push(`User sync error: ${error}`);
          result.success = false;
        }
      }
      
      this.lastSyncTimestamp = Date.now();
    } catch (error) {
      result.success = false;
      result.errors!.push(`Sync error: ${error}`);
    } finally {
      this.isSyncing = false;
      
      // Process any queued sync operations
      if (this.syncQueue.length > 0) {
        const nextSync = this.syncQueue.shift();
        if (nextSync) {
          nextSync();
        }
      }
    }
    
    return result;
  }
  
  /**
   * Sync audits with the server
   * @returns Promise resolving to synced audits
   */
  private async syncAudits(): Promise<Audit[]> {
    // This would be implemented with actual API calls in a real app
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  }
  
  /**
   * Sync photos with the server
   * @returns Promise resolving to synced photo IDs
   */
  private async syncPhotos(): Promise<string[]> {
    // This would be implemented with actual API calls in a real app
    await new Promise(resolve => setTimeout(resolve, 700));
    return [];
  }
  
  /**
   * Sync users with the server
   * @returns Promise resolving to synced users
   */
  private async syncUsers(): Promise<User[]> {
    // This would be implemented with actual API calls in a real app
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  }
}

export default new SyncService();