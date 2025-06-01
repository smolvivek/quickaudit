/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {AuthProvider} from './src/contexts/AuthContext';
import {SubscriptionProvider} from './src/contexts/SubscriptionContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import ThemeProvider from './src/theme/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <AppNavigator />
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
