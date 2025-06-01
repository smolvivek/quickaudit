import { useState, useCallback } from 'react';
import { Animated } from 'react-native';
import { useScreenTransition } from './useScreenTransition';
import { useScreenFocus } from './useScreenFocus';
import { useScreenGestures } from './useScreenGestures';

type ScreenState = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isRefreshing: boolean;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
};

type ScreenStateCallbacks = {
  onRefresh?: () => Promise<void>;
  onRetry?: () => Promise<void>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
};

export const useScreenState = (callbacks: ScreenStateCallbacks = {}) => {
  const [state, setState] = useState<ScreenState>({
    isLoading: false,
    isError: false,
    errorMessage: null,
    isRefreshing: false,
    fadeAnim: new Animated.Value(0),
    slideAnim: new Animated.Value(100),
    scaleAnim: new Animated.Value(0),
  });

  const { fadeIn, fadeOut, slideIn, slideOut, scaleIn, scaleOut } = useScreenTransition();

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: Error | string | null) => {
    setState((prev) => ({
      ...prev,
      isError: !!error,
      errorMessage: error instanceof Error ? error.message : error,
    }));
  }, []);

  const setRefreshing = useCallback((isRefreshing: boolean) => {
    setState((prev) => ({ ...prev, isRefreshing }));
  }, []);

  const handleRefresh = useCallback(async () => {
    if (callbacks.onRefresh) {
      setRefreshing(true);
      try {
        await callbacks.onRefresh();
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error : 'Failed to refresh');
      } finally {
        setRefreshing(false);
      }
    }
  }, [callbacks.onRefresh, setError, setRefreshing]);

  const handleRetry = useCallback(async () => {
    if (callbacks.onRetry) {
      setLoading(true);
      try {
        await callbacks.onRetry();
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error : 'Failed to retry');
      } finally {
        setLoading(false);
      }
    }
  }, [callbacks.onRetry, setError, setLoading]);

  const panResponder = useScreenGestures({
    onSwipeLeft: callbacks.onSwipeLeft,
    onSwipeRight: callbacks.onSwipeRight,
    onSwipeUp: callbacks.onSwipeUp,
    onSwipeDown: callbacks.onSwipeDown,
    onTap: callbacks.onTap,
    onLongPress: callbacks.onLongPress,
  });

  useScreenFocus(
    () => {
      fadeIn(state.fadeAnim);
      slideIn(state.slideAnim);
      scaleIn(state.scaleAnim);
      return () => {
        fadeOut(state.fadeAnim);
        slideOut(state.slideAnim);
        scaleOut(state.scaleAnim);
      };
    },
    undefined,
    [state.fadeAnim, state.slideAnim, state.scaleAnim]
  );

  return {
    state,
    setLoading,
    setError,
    setRefreshing,
    handleRefresh,
    handleRetry,
    panResponder,
  };
}; 