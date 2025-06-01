/**
 * ConfigProvider
 * Provides app configuration settings
 */

import React, { createContext, useContext } from 'react';
import { whiteLabelConfig, WhiteLabelConfig } from './whiteLabelConfig';

// App configuration interface
interface AppConfig {
  apiUrl: string;
  whiteLabelConfig: WhiteLabelConfig;
  appVersion: string;
  buildNumber: string;
  isProduction: boolean;
  defaultLanguage: string;
  supportEmail: string;
}

// Default configuration
const defaultConfig: AppConfig = {
  apiUrl: 'https://api.quickaudit.com/v1',
  whiteLabelConfig,
  appVersion: '1.0.0',
  buildNumber: '1',
  isProduction: false,
  defaultLanguage: 'en',
  supportEmail: 'support@quickaudit.com'
};

// Create context
const ConfigContext = createContext<AppConfig>(defaultConfig);

// Config provider component
export const ConfigProvider: React.FC<{ children: React.ReactNode; config?: Partial<AppConfig> }> = ({ 
  children, 
  config = {} 
}) => {
  // Merge default config with provided config
  const mergedConfig: AppConfig = {
    ...defaultConfig,
    ...config,
    whiteLabelConfig: {
      ...defaultConfig.whiteLabelConfig,
      ...(config.whiteLabelConfig || {})
    }
  };
  
  return (
    <ConfigContext.Provider value={mergedConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

// Hook for using config context
export const useConfig = () => useContext(ConfigContext);

export default ConfigContext;