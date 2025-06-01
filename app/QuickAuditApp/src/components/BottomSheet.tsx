import React, {useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ViewStyle,
  Animated,
  PanResponder,
  Dimensions,
, TextStyle} from 'react-native';
import {Icon} from './Icon';
import {colors} from '../theme/designSystem';

interface BottomSheetProps {
  visible: boolean;, onClose: () => void;, children: React.ReactNode;
  containerStyle?: ViewStyle;
  snapPoints?: number[];
  initialSnapPoint?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({visible: any,    onClose: any,    children: any,    containerStyle: any,    snapPoints = [0.25: any,    0.5: any,    0.75]: any,    initialSnapPoint = 0.5: any,    : any}) => {
  const {height: screenHeight} = Dimensions.get('window');
  

const translateY = useRef(new Animated.Value(screenHeight)).current;
  const currentSnapPoint = useRef(initialSnapPoint);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentPoint = currentSnapPoint.current;
        const velocity = gestureState.vy;
        const moveDistance = gestureState.dy;

        let nextPoint = currentPoint;
        if (Math.abs(velocity) > 0.5) {
          if (velocity > 0) {
            nextPoint = Math.max(0, currentPoint - 1);
          } else {
            nextPoint = Math.min(snapPoints.length - 1, currentPoint + 1);
          }
        } else if (Math.abs(moveDistance) > screenHeight * 0.1) {
          if (moveDistance > 0) {
            nextPoint = Math.max(0, currentPoint - 1);
          } else {
            nextPoint = Math.min(snapPoints.length - 1, currentPoint + 1);
          }
        }

        currentSnapPoint.current = nextPoint;
        const snapTo = screenHeight * (1 - snapPoints[nextPoint]);

        Animated.spring(translateY, {
          toValue: snapTo,
          useNativeDriver: true,
          velocity: velocity,
          tension: 40,
          friction: 7,
        }).start();
      },
    }),
  ).current;

  const handleClose = useCallback(() => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [onClose, screenHeight, translateY]);

  const handleShow = useCallback(() => {
    const snapTo = screenHeight * (1 - snapPoints[initialSnapPoint]);
    Animated.spring(translateY, {
      toValue: snapTo,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();
  }, [initialSnapPoint, screenHeight, snapPoints, translateY]);

  React.useEffect(() => {
    if (visible) {
      handleShow();
    }
  }, [visible, handleShow]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.container,
            containerStyle,
            {
              transform: [{translateY}],
            },
          ]}
          {...panResponder.panHandlers}>
          <View style={styles.handle}>
            <View style={styles.handleBar} />
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.paper,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 200,
    maxHeight: '90%',
  },
  handle: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
});
