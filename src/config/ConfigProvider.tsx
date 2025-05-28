import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WhiteLabelConfig, defaultWhiteLabelConfig } from './whiteLabelConfig';
import { AppConfig } from './appConfig';

interface ConfigContextType {
  config: WhiteLabelConfig;
  updateConfig: (config: Partial<WhiteLabelConfig>) => Promise<void>;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WhiteLabelConfig>(defaultWhiteLabelConfig);
  const [loading, setLoading] = useState(true);

  const loadConfig = async () => {
    try {
      const storedConfig = await AsyncStorage.getItem('whiteLabelConfig');
      if (storedConfig) {
        setConfig({ ...defaultWhiteLabelConfig, ...JSON.parse(storedConfig) });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig: Partial<WhiteLabelConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      await AsyncStorage.setItem('whiteLabelConfig', JSON.stringify(updatedConfig));
    } catch (error) {
      console.error('Error updating config:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, updateConfig, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
