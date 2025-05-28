import React from 'react';
import { MD3LightTheme, Provider as PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { colors, typography, spacing, borderRadius, shadows } from './designSystem';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary.main,
    secondary: colors.secondary.main,
    error: colors.error.main,
    warning: colors.warning.main,
    success: colors.success.main,
    background: colors.background.default,
    surface: colors.background.paper,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
  },
  typography,
  spacing,
  borderRadius,
  shadows,
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
}; 