import {MD3LightTheme, configureFonts} from 'react-native-paper';

// Configure fonts to match the web app
const fonts = configureFonts({
  config: {
    headlineSmall: {
      fontFamily: 'System',
      fontWeight: '400',
      fontSize: 24,
      letterSpacing: 0,
      lineHeight: 32,
    },
    titleMedium: {
      fontFamily: 'System',
      fontWeight: '500',
      fontSize: 16,
      letterSpacing: 0,
      lineHeight: 24,
    },
    bodyMedium: {
      fontFamily: 'System',
      fontWeight: '400',
      fontSize: 14,
      letterSpacing: 0,
      lineHeight: 20,
    },
    labelMedium: {
      fontFamily: 'System',
      fontWeight: '500',
      fontSize: 12,
      letterSpacing: 0,
      lineHeight: 16,
    },
  },
});

// Theme colors to match the web app
export const theme = {
  ...MD3LightTheme,
  ...fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3333FF', // Dark blue from web app
    secondary: '#FFFFFF', // White from web app
    accent: '#00C853', // Green accent from web app
    background: '#F5F5F5', // Light gray background from web app
    surface: '#FFFFFF',
    error: '#EB5757',
    success: '#00C853', // Green success color from web app
    text: '#333333', // Text color from web app
    disabled: '#757575', // Dark gray from web app
    placeholder: '#BDBDBD', // Medium gray from web app
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onPrimary: '#FFFFFF',
    onSecondary: '#333333',
    onBackground: '#333333',
    onSurface: '#333333',
  },
  roundness: 8, // Match the web app's border radius
  animation: {
    scale: 1.0,
  },
  dark: false,
} as const;
