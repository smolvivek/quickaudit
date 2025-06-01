import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { initDatabase } from './services/databaseService';
import { syncService } from './services/syncService';
import AuthManager from './components/AuthManager';
import OfflineManager from './components/OfflineManager';
import NetworkStatus from './components/NetworkStatus';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  // Initialize database and sync service on app start
  useEffect(() => {
    const setupServices = async () => {
      try {
        // Initialize database
        await initDatabase();
        console.log('Database initialized successfully');

        // Initialize sync service
        await syncService.initialize();
        console.log('Sync service initialized successfully');
      } catch (error) {
        console.error('Service initialization error:', error);
      }
    };

    setupServices();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <AuthManager>
            <OfflineManager>
              <NetworkStatus />
              <AppNavigator />
            </OfflineManager>
          </AuthManager>
        </View>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

export default App;
