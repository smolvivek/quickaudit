import React from 'react';
import {Button, ButtonProps} from 'react-native-paper';
import {theme} from '../../theme/theme';

export interface QuickAuditButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const QuickAuditButton = ({
  variant = 'primary',
  mode = 'contained',
  ...props
}: QuickAuditButtonProps) => {
  const getMode = () => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'contained-tonal';
      case 'outline':
        return 'outlined';
      case 'ghost':
        return 'text';
      default:
        return mode;
    }
  };

  

const getColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Button
      mode={getMode()}
      style={{
        borderRadius: theme.roundness,
        paddingVertical: 8,
        paddingHorizontal: 16,
      }}
      contentStyle={{
        paddingVertical: 8,
      }}
      {...props}
    />
  );
};
