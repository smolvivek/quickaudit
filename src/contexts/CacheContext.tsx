import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from './SettingsContext';
import { useToast } from './ToastContext';
import { useLoading } from './LoadingContext';

interface CacheItem<T> {
  key: string;
  data: T;
  timestamp: number;
  size: number;
}

interface CacheContextData {
  getItem: <T>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, data: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clearCache: () => Promise<void>;
  getCacheSize: () => Promise<number>;
  getCacheKeys: () => Promise<string[]>;
}

const CacheContext = createContext<CacheContextData>({} as CacheContextData);

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings } = useSettings();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const getCacheKeys = useCallback(async (): Promise<string[]> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter((key) => key.startsWith('@QuickAudit:cache:'));
    } catch (error) {
      console.error('Error getting cache keys:', error);
      return [];
    }
  }, []);

  const getItem = useCallback(async <T,>(key: string): Promise<T | null> => {
    try {
      const item = await AsyncStorage.getItem(`@QuickAudit:cache:${key}`);
      if (!item) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (now - cacheItem.timestamp > maxAge) {
        await removeItem(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error(`Error getting cache item ${key}:`, error);
      return null;
    }
  }, []);

  const removeItem = useCallback(async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(`@QuickAudit:cache:${key}`);
    } catch (error) {
      console.error(`Error removing cache item ${key}:`, error);
    }
  }, []);

  const getCacheSize = useCallback(async (): Promise<number> => {
    try {
      const keys = await getCacheKeys();
      let totalSize = 0;

      for (const key of keys) {
        const item = await AsyncStorage.getItem(`@QuickAudit:cache:${key}`);
        if (item) {
          totalSize += item.length;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }, [getCacheKeys]);

  const clearCache = useCallback(async (): Promise<void> => {
    try {
      showLoading();
      const keys = await getCacheKeys();
      await Promise.all(keys.map((key) => removeItem(key)));
      showToast('Cache cleared successfully', 'success');
    } catch (error) {
      showToast('Failed to clear cache', 'error');
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast, getCacheKeys, removeItem]);

  const setItem = useCallback(
    async <T,>(key: string, data: T): Promise<void> => {
      try {
        const cacheItem: CacheItem<T> = {
          key,
          data,
          timestamp: Date.now(),
          size: JSON.stringify(data).length,
        };

        const currentSize = await getCacheSize();
        const maxSize = settings.data.cacheSize * 1024 * 1024; // Convert MB to bytes

        if (currentSize + cacheItem.size > maxSize) {
          await clearCache();
        }

        await AsyncStorage.setItem(
          `@QuickAudit:cache:${key}`,
          JSON.stringify(cacheItem)
        );
      } catch (error) {
        console.error(`Error setting cache item ${key}:`, error);
      }
    },
    [settings.data.cacheSize, getCacheSize, clearCache]
  );

  useEffect(() => {
    const checkCacheSize = async () => {
      const currentSize = await getCacheSize();
      const maxSize = settings.data.cacheSize * 1024 * 1024; // Convert MB to bytes

      if (currentSize > maxSize) {
        await clearCache();
      }
    };

    checkCacheSize();
  }, [settings.data.cacheSize, getCacheSize, clearCache]);

  return (
    <CacheContext.Provider
      value={{
        getItem,
        setItem,
        removeItem,
        clearCache,
        getCacheSize,
        getCacheKeys,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = (): CacheContextData => {
  const context = useContext(CacheContext);

  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }

  return context;
}; 