import React, { useState, useEffect, useMemo } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';

// Import navigation
import AppNavigator from './navigation/AppNavigator';

// Create an authentication context
export const AuthContext = React.createContext();

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// Main App component with authentication state
function MainApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // In a real app, you would validate the token with your backend
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          setUserToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Failed to load user data', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Authentication methods
  const authContext = useMemo(
    () => ({
      signIn: async (token, userData) => {
        try {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          setUserToken(token);
          setUser(userData);
        } catch (e) {
          console.error('Failed to save user data', e);
          throw e;
        }
      },
      signUp: async (userData) => {
        try {
          // In a real app, this would be an API call to register the user
          const token = `dummy-token-${Date.now()}`;
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          setUserToken(token);
          setUser(userData);
          return { success: true };
        } catch (e) {
          console.error('Failed to sign up', e);
          throw e;
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
          setUserToken(null);
          setUser(null);
        } catch (e) {
          console.error('Failed to sign out', e);
        }
      },
      user,
    }),
    [user]
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator isAuthenticated={!!userToken} />
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

// Root App component that wraps everything with ThemeProvider
const App = () => {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
};

export default App;
