/**
 * Hook for managing screen state with loading, error, and refresh functionality
 */

import { useState, useCallback } from 'react';

interface UseScreenStateOptions<T> {
  initialData?: T;
  fetchData?: () => Promise<T>;
  onError?: (error: Error) => void;
}

interface ScreenState<T> {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
}

function useScreenState<T>(options: UseScreenStateOptions<T> = {}) {
  const { initialData = null, fetchData, onError } = options;
  
  const [state, setState] = useState<ScreenState<T>>({
    data: initialData,
    isLoading: false,
    isRefreshing: false,
    error: null
  });
  
  const load = useCallback(async () => {
    if (!fetchData) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await fetchData();
      setState(prev => ({ ...prev, data, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('An unknown error occurred'), 
        isLoading: false 
      }));
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [fetchData, onError]);
  
  const refresh = useCallback(async () => {
    if (!fetchData) return;
    
    setState(prev => ({ ...prev, isRefreshing: true, error: null }));
    
    try {
      const data = await fetchData();
      setState(prev => ({ ...prev, data, isRefreshing: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('An unknown error occurred'), 
        isRefreshing: false 
      }));
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [fetchData, onError]);
  
  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);
  
  const setError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error }));
  }, []);
  
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);
  
  return {
    ...state,
    load,
    refresh,
    setData,
    setError,
    clearError
  };
}

export default useScreenState;