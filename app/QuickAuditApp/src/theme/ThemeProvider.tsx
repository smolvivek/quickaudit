/**
 * Theme Provider
 * Provides theme context for the application
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme } from './designSystem';
import { componentStyles } from './componentStyles';

type ThemeContextType = {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  styles: typeof componentStyles;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  styles: componentStyles,
});

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * ThemeProvider component that provides the theme context to all child components
 * Uses the web app-aligned theme to ensure consistent styling across platforms
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // For now, we'll always use the light theme to match the web app
  const isDarkMode = false;
  
  return (
    <ThemeContext.Provider value={{ theme: lightTheme, isDarkMode, styles: componentStyles }}>
      <PaperProvider theme={lightTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the theme context
 * @returns ThemeContextType object containing theme, isDarkMode, and styles
 */
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;