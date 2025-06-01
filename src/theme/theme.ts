import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fonts = configureFonts({
  config: {
    fontFamily: 'Inter',
    ios: {
      fontWeight: '400',
      fontFamily: 'Inter',
      fontSize: 16,
      letterSpacing: 0,
      lineHeight: 24,
    },
    android: {
      fontWeight: '400',
      fontFamily: 'Inter',
      fontSize: 16,
      letterSpacing: 0,
      lineHeight: 24,
    },
  },
});

export const theme = {
  ...MD3LightTheme,
  ...fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2F80ED',
    secondary: '#1B2A4E',
    background: '#F4F6F8',
    surface: '#FFFFFF',
    error: '#EB5757',
    success: '#27AE60',
    text: '#1B2A4E',
    disabled: '#8D99AE',
    placeholder: '#BDBDBD',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
  dark: false,
} as const;
