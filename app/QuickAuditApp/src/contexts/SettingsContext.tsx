/**
 * SettingsContext
 * Provides app settings management
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';

// Theme options
export type ThemeMode = 'light' | 'dark' | 'system';

// Language options
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

// Settings interface
interface Settings {
  theme: ThemeMode;
  language: Language;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  autoSync: boolean;
  syncInterval: number; // in minutes
  fontScale: number;
}

// Settings context interface
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isDarkMode: boolean;
  currentLanguage: Language;
}

// Default settings
const defaultSettings: Settings = {
  theme: 'system',
  language: 'en',
  notificationsEnabled: true,
  soundEnabled: true,
  hapticFeedbackEnabled: true,
  autoSync: true,
  syncInterval: 15,
  fontScale: 1.0
};

// Create context with default values
const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  resetSettings: async () => {},
  isDarkMode: false,
  currentLanguage: 'en'
});

// Settings provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('app_settings');
        
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Update dark mode based on settings and system theme
  useEffect(() => {
    const updateTheme = () => {
      const systemTheme = Appearance.getColorScheme();
      
      if (settings.theme === 'system') {
        setIsDarkMode(systemTheme === 'dark');
      } else {
        setIsDarkMode(settings.theme === 'dark');
      }
    };
    
    updateTheme();
    
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (settings.theme === 'system') {
        setIsDarkMode(colorScheme === 'dark');
      }
    });
    
    return () => {
      subscription.remove();
    };
  }, [settings.theme]);
  
  // Update settings
  const updateSettings = async (newSettings: Partial<Settings>): Promise<void> => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('app_settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };
  
  // Reset settings to defaults
  const resetSettings = async (): Promise<void> => {
    try {
      setSettings(defaultSettings);
      await AsyncStorage.setItem('app_settings', JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };
  
  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isDarkMode,
        currentLanguage: settings.language
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Hook for using settings context
export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;