import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/designSystem';

interface DividerProps {
  style?: ViewStyle;
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: number;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  orientation = 'horizontal',
  thickness = 1,
  color = colors.divider,
  spacing = 16,
}) => {
  const getDividerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: color,
    };

    if (orientation === 'horizontal') {
      return {
        ...baseStyle,
        height: thickness,
        marginVertical: spacing,
      };
    }

    return {
      ...baseStyle,
      width: thickness,
      marginHorizontal: spacing,
    };
  };

  return <View style={[getDividerStyle(), style]} />;
};

const styles = StyleSheet.create({}); 