/**
 * Script to fix TypeScript errors in ThemeProvider
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Fix ThemeProvider.tsx
const fixThemeProvider = () => {
  const dirPath = path.join(process.cwd(), 'src/theme');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Theme Provider
 * Provides theme context for the application
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { appTheme } from './webAppTheme';

// Define the theme context type
interface ThemeContextType {
  theme: typeof appTheme;
  toggleTheme?: () => void;
}

// Create the theme context
const ThemeContext = createContext<ThemeContextType>({ theme: appTheme });

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider props type
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // We're using the web app theme by default
  const theme = appTheme;
  
  return (
    <ThemeContext.Provider value={{ theme }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;`;

  fs.writeFileSync(path.join(dirPath, 'ThemeProvider.tsx'), content, 'utf8');
  console.log('Fixed ThemeProvider.tsx');
};

// Run the function
console.log('Fixing ThemeProvider...');
fixThemeProvider();
console.log('ThemeProvider fixed successfully!');
