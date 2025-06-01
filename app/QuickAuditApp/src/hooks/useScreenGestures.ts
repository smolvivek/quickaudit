/**
 * Hook for handling common screen gestures
 */

import { useRef } from 'react';
import { PanResponder, Animated, Dimensions } from 'react-native';

interface UseScreenGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

const useScreenGestures = (options: UseScreenGesturesOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50
  } = options;
  
  const pan = useRef(new Animated.ValueXY()).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        pan.extractOffset();
        
        const { dx, dy } = gestureState;
        
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > threshold && onSwipeRight) {
            onSwipeRight();
          } else if (dx < -threshold && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (dy > threshold && onSwipeDown) {
            onSwipeDown();
          } else if (dy < -threshold && onSwipeUp) {
            onSwipeUp();
          }
        }
        
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    })
  ).current;
  
  return {
    panResponder,
    pan
  };
};

export default useScreenGestures;