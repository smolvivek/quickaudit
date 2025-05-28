/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { SubscriptionProvider } from './src/contexts/SubscriptionContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/theme/designSystem';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SubscriptionProvider>
          <AppNavigator />
        </SubscriptionProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
