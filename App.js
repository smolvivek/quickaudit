import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { databaseService } from './src/services/databaseService';
import { syncService } from './src/services/syncService';
import { notificationService } from './src/services/notificationService';
import NotificationHandler from './src/components/NotificationHandler';

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        await databaseService.initDatabase();
        
        // Initialize sync service
        await syncService.initialize();
        
        // Initialize notification service
        await notificationService.initialize();
        
        console.log('App initialized successfully');
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <NotificationHandler />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App; 