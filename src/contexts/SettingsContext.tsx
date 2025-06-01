import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from './ToastContext';

interface Settings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  appearance: {
    fontSize: 'small' | 'medium' | 'large';
    reduceMotion: boolean;
    highContrast: boolean;
  };
  data: {
    autoSync: boolean;
    syncInterval: number;
    cacheSize: number;
  };
  privacy: {
    biometricAuth: boolean;
    autoLock: boolean;
    lockTimeout: number;
  };
}

interface SettingsContextData {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  appearance: {
    fontSize: 'medium',
    reduceMotion: false,
    highContrast: false,
  },
  data: {
    autoSync: true,
    syncInterval: 15, // minutes
    cacheSize: 100, // MB
  },
  privacy: {
    biometricAuth: false,
    autoLock: true,
    lockTimeout: 5, // minutes
  },
};

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { showToast } = useToast();

  useEffect(() => {
    const loadStoredSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('@QuickAudit:settings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Failed to load stored settings:', error);
      }
    };

    loadStoredSettings();
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<Settings>) => {
      try {
        const updatedSettings = {
          ...settings,
          ...newSettings,
        };
        await AsyncStorage.setItem(
          '@QuickAudit:settings',
          JSON.stringify(updatedSettings)
        );
        setSettings(updatedSettings);
        showToast('Settings updated successfully', 'success');
      } catch (error) {
        showToast('Failed to update settings', 'error');
        throw error;
      }
    },
    [settings, showToast]
  );

  const resetSettings = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@QuickAudit:settings');
      setSettings(defaultSettings);
      showToast('Settings reset to default', 'success');
    } catch (error) {
      showToast('Failed to reset settings', 'error');
      throw error;
    }
  }, [showToast]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextData => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}; 