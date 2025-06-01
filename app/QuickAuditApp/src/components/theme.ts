import {DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563eb', // primary-blue
    secondary: '#0d9488', // secondary-teal
    tertiary: '#8b5cf6', // tertiary-purple
    background: '#ffffff',
    surface: '#f8fafc',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    border: '#e2e8f0',
    text: '#1e293b',
    lightText: '#64748b',
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'Inter-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Inter-Medium',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Inter-Light',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Inter-Thin',
      fontWeight: '100',
    },
  },
};
