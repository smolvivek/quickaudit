import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {colors} from '../theme/designSystem';

interface DividerProps {
  style?: ViewStyle;
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: number;
}

export const Divider: React.FC<DividerProps> = ({style: any,    orientation = 'horizontal': any,    thickness = 1: any,    color = colors.divider: any,    spacing = 16: any,    : any}) => {
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
