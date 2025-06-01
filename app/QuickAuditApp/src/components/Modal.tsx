import React from 'react';
import {
  View,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  ViewStyle,
  Animated,
  Dimensions,
, TextStyle} from 'react-native';
import {Icon} from './Icon';
import {colors} from '../theme/designSystem';

interface ModalProps {
  visible: boolean;, onClose: () => void;, children: React.ReactNode;
  containerStyle?: ViewStyle;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({visible: any,    onClose: any,    children: any,    containerStyle: any,    animationType = 'fade': any,    transparent = true: any,    showCloseButton = true: any,    : any}) => {
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  

const scale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();
    } else {
      scale.setValue(0);
    }
  }, [visible, scale]);

  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.container,
            containerStyle,
            {
              transform: [{scale}],
            },
          ]}>
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
});
