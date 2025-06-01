/**
 * Script to fix Toast.tsx component TypeScript errors
 */

const fs = require('fs');
const path = require('path');

// Fix Toast.tsx
const fixToastComponent = () => {
  const filePath = path.join(process.cwd(), 'src/components/Toast.tsx');
  
  const content = `/**
 * Toast Component
 * Displays toast notifications
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useToast, Toast as ToastType, ToastType as ToastVariant } from '../contexts/ToastContext';
import { appTheme } from '../theme';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

// Toast component
const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  
  // Animate toast in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      dismissToast();
    }, toast.duration || 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Dismiss toast with animation
  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };
  
  // Get icon and background color based on toast type
  const getToastStyles = (type: ToastVariant) => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          backgroundColor: appTheme.colors.success,
        };
      case 'error':
        return {
          icon: 'alert-circle',
          backgroundColor: appTheme.colors.error,
        };
      case 'warning':
        return {
          icon: 'alert',
          backgroundColor: appTheme.colors.warning,
        };
      case 'info':
      default:
        return {
          icon: 'information',
          backgroundColor: appTheme.colors.info,
        };
    }
  };
  
  const { icon, backgroundColor } = getToastStyles(toast.type);
  
  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor },
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.content}>
        <Icon name={icon} size={24} color="white" style={styles.icon} />
        <Text style={styles.message}>{toast.message}</Text>
      </View>
      <TouchableOpacity onPress={dismissToast} style={styles.closeButton}>
        <Icon name="close" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Toast container component
export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();
  
  if (toasts.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.toastContainer}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={hideToast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: '90%',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});

export default Toast;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed Toast.tsx');
};

// Run the function
console.log('Fixing Toast component...');
fixToastComponent();
console.log('Toast component fixed successfully!');
