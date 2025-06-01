import {useCallback} from 'react';
import {Animated, Easing, TextStyle} from 'react-native';

export const useScreenTransition = () => {
  const fadeIn = useCallback((value: Animated.Value) => {
    Animated.timing(value, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  

const fadeOut = useCallback((value: Animated.Value) => {
    Animated.timing(value, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  const slideIn = useCallback((value: Animated.Value) => {
    Animated.timing(value, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const slideOut = useCallback((value: Animated.Value) => {
    Animated.timing(value, {
      toValue: 100,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const scaleIn = useCallback((value: Animated.Value) => {
    Animated.spring(value, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const scaleOut = useCallback((value: Animated.Value) => {
    Animated.spring(value, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return {
    fadeIn,
    fadeOut,
    slideIn,
    slideOut,
    scaleIn,
    scaleOut,
  };
};
