import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Theme from '../theme/Theme';
import COLORS from '../theme/Colors';

// Create the theme context
const ThemeContext = createContext({
  theme: 'light',
  colors: COLORS,
  typography: Theme.TYPOGRAPHY,
  textStyles: Theme.TEXT_STYLES,
  spacing: Theme.SPACING,
  setTheme: () => {},
  toggleTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get device color scheme
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'light');

  // Update theme when device color scheme changes
  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme);
    }
  }, [colorScheme]);

  // Get theme components
  const colors = COLORS;
  const typography = Theme.TYPOGRAPHY;
  const textStyles = Theme.TEXT_STYLES;
  const spacing = Theme.SPACING;

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      colors,
      typography,
      textStyles,
      spacing,
      setTheme,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
