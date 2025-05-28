import React from 'react';
import { Card, CardProps } from 'react-native-paper';
import { theme } from '../../theme/theme';

interface QuickAuditCardProps extends CardProps {
  variant?: 'primary' | 'secondary' | 'surface';
}

export const QuickAuditCard: React.FC<QuickAuditCardProps> = ({
  variant = 'surface',
  style,
  ...props
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'surface':
        return theme.colors.surface;
      default:
        return theme.colors.surface;
    }
  };

  return (
    <Card
      style={{
        borderRadius: theme.roundness,
        backgroundColor: getBackgroundColor(),
        ...style,
      }}
      {...props}
    />
  );
};
