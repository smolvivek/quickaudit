/**
 * Script to fix CacheContext.tsx TypeScript errors
 */

const fs = require('fs');
const path = require('path');

// Fix CacheContext.tsx
const fixCacheContext = () => {
  const filePath = path.join(process.cwd(), 'src/contexts/CacheContext.tsx');
  
  const content = `/**
 * CacheContext
 * Provides caching functionality for the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache item interface
interface CacheItem {
  key: string;
  value: any;
  timestamp: number;
  expiry?: number; // Optional expiry time in milliseconds
}

// Cache context interface
interface CacheContextType {
  getItem: <T>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, value: T, expiry?: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clearCache: () => Promise<void>;
  isExpired: (key: string) => Promise<boolean>;
}

// Create context with default values
const CacheContext = createContext<CacheContextType>({
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
  clearCache: async () => {},
  isExpired: async () => true
});

// Cache provider component
export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get item from cache
  const getItem = async <T,>(key: string): Promise<T | null> => {
    try {
      const data = await AsyncStorage.getItem(\`cache_\${key}\`);
      
      if (!data) {
        return null;
      }
      
      const cacheItem: CacheItem = JSON.parse(data);
      
      // Check if item is expired
      if (cacheItem.expiry && Date.now() > cacheItem.timestamp + cacheItem.expiry) {
        await removeItem(key);
        return null;
      }
      
      return cacheItem.value as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  };
  
  // Set item in cache
  const setItem = async <T,>(key: string, value: T, expiry?: number): Promise<void> => {
    try {
      const cacheItem: CacheItem = {
        key,
        value,
        timestamp: Date.now(),
        expiry
      };
      
      await AsyncStorage.setItem(\`cache_\${key}\`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  };
  
  // Remove item from cache
  const removeItem = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(\`cache_\${key}\`);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  };
  
  // Clear all cache
  const clearCache = async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  };
  
  // Check if item is expired
  const isExpired = async (key: string): Promise<boolean> => {
    try {
      const data = await AsyncStorage.getItem(\`cache_\${key}\`);
      
      if (!data) {
        return true;
      }
      
      const cacheItem: CacheItem = JSON.parse(data);
      
      return !!(cacheItem.expiry && Date.now() > cacheItem.timestamp + cacheItem.expiry);
    } catch (error) {
      console.error('Cache expiry check error:', error);
      return true;
    }
  };
  
  return (
    <CacheContext.Provider
      value={{
        getItem,
        setItem,
        removeItem,
        clearCache,
        isExpired
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

// Hook for using cache context
export const useCache = () => useContext(CacheContext);

export default CacheContext;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed CacheContext.tsx');
};

// Run the function
console.log('Fixing CacheContext...');
fixCacheContext();
console.log('CacheContext fixed successfully!');
