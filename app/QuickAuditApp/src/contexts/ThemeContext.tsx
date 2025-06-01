/**
 * Theme Context
 * Provides theme functionality throughout the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { appTheme } from '../theme/webAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WhiteLabelConfig from '../features/whitelabel/WhiteLabelConfig';

// Theme mode type
type ThemeMode = 'light' | 'dark' | 'system';

// Theme context interface
interface ThemeContextType {
  theme: typeof appTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: appTheme,
  themeMode: 'system',
  setThemeMode: () => {},
  isDarkMode: false
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference to storage
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('themeMode', themeMode);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [themeMode]);
  
  // Update dark mode based on theme mode and system preference
  useEffect(() => {
    // In a real app, this would check system preference if themeMode is 'system'
    setIsDarkMode(themeMode === 'dark');
  }, [themeMode]);
  
  // Get theme colors from white label config if enabled
  const theme = {
    ...appTheme,
    colors: {
      ...appTheme.colors,
      ...(WhiteLabelConfig.isEnabled() ? WhiteLabelConfig.getThemeColors() : {})
    }
  };
  
  // Set theme mode
  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode: handleSetThemeMode,
        isDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;