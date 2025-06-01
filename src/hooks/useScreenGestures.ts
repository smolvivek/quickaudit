import { useCallback } from 'react';
import { GestureResponderEvent, PanResponder, PanResponderGestureState } from 'react-native';

type GestureCallbacks = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
};

export const useScreenGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
}: GestureCallbacks) => {
  const handlePanResponderMove = useCallback(
    (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const { dx, dy } = gestureState;
      const SWIPE_THRESHOLD = 50;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > SWIPE_THRESHOLD && onSwipeRight) {
          onSwipeRight();
        } else if (dx < -SWIPE_THRESHOLD && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        if (dy > SWIPE_THRESHOLD && onSwipeDown) {
          onSwipeDown();
        } else if (dy < -SWIPE_THRESHOLD && onSwipeUp) {
          onSwipeUp();
        }
      }
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]
  );

  const handlePanResponderRelease = useCallback(
    (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const { dx, dy } = gestureState;
      const TAP_THRESHOLD = 5;

      if (Math.abs(dx) < TAP_THRESHOLD && Math.abs(dy) < TAP_THRESHOLD) {
        if (onTap) {
          onTap();
        }
      }
    },
    [onTap]
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
    onPanResponderTerminate: () => {},
  });

  return panResponder;
}; 