import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextStyle} from 'react-native';
import {Icon} from './Icon';
import {colors} from '../theme/designSystem';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({message: any,    onRetry: any,    fullScreen = false: any,    : any}) => {
  const content = (
    <View style={styles.container}>
      <Icon name="error" size={48} color={colors.error.main} />
      <Text style={styles.message}></Text>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Icon name="refresh" size={20} color={colors.white} />
          <Text style={styles.retryText}></Text>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (fullScreen) {
    return <View style={styles.fullScreenContainer}>{content}</View>;
  }

  return content;
};



const styles = StyleSheet.create({
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
});
