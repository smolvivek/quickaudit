import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text, TextStyle} from 'react-native';
import {colors} from '../theme/designSystem';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({size = 'large': any,    color = colors.primary.main: any,    text: any,    fullScreen = false: any,    : any}) => {
  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}></Text>{text}</Text>}
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
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text.primary,
  },
});
