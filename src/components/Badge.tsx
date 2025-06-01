import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/designSystem';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.container,
      ...styles[`${size}Container`],
      ...styles[`${variant}Container`],
    };

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...styles[`${size}Text`],
      ...styles[`${variant}Text`],
    };

    return baseStyle;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  smallContainer: {
    paddingVertical: 2,
  },
  mediumContainer: {
    paddingVertical: 4,
  },
  largeContainer: {
    paddingVertical: 6,
  },
  primaryContainer: {
    backgroundColor: colors.primary.main,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary.main,
  },
  successContainer: {
    backgroundColor: colors.success.main,
  },
  errorContainer: {
    backgroundColor: colors.error.main,
  },
  warningContainer: {
    backgroundColor: colors.warning.main,
  },
  infoContainer: {
    backgroundColor: colors.info.main,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  successText: {
    color: colors.white,
  },
  errorText: {
    color: colors.white,
  },
  warningText: {
    color: colors.white,
  },
  infoText: {
    color: colors.white,
  },
}); 