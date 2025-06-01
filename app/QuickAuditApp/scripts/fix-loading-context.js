/**
 * Script to fix LoadingContext.tsx TypeScript errors
 */

const fs = require('fs');
const path = require('path');

// Fix LoadingContext.tsx
const fixLoadingContext = () => {
  const filePath = path.join(process.cwd(), 'src/contexts/LoadingContext.tsx');
  
  const content = `/**
 * LoadingContext
 * Provides loading state management for the app
 */

import React, { createContext, useState, useContext } from 'react';

// Loading context interface
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingMessage: string | null;
  setLoadingMessage: (message: string | null) => void;
}

// Create context with default values
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
  loadingMessage: null,
  setLoadingMessage: () => {}
});

// Loading provider component
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setLoadingMessage(null);
    }
  };
  
  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        loadingMessage,
        setLoadingMessage
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

// Hook for using loading context
export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed LoadingContext.tsx');
};

// Run the function
console.log('Fixing LoadingContext...');
fixLoadingContext();
console.log('LoadingContext fixed successfully!');
