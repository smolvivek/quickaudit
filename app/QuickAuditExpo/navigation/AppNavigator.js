import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import NewAuditScreen from '../screens/NewAuditScreen';
import TemplateSelectScreen from '../screens/TemplateSelectScreen';

// Import context
import { AuthContext } from '../App';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isAuthenticated }) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}
      >
        {isAuthenticated ? (
          // Authenticated screens
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabNavigator} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="NewAudit" 
              component={NewAuditScreen} 
              options={{ 
                title: 'New Audit',
                headerStyle: {
                  backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  fontWeight: '600',
                },
              }} 
            />
            <Stack.Screen 
              name="TemplateSelect" 
              component={TemplateSelectScreen} 
              options={{ 
                title: 'Select Template',
                headerStyle: {
                  backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  fontWeight: '600',
                },
                presentation: 'modal',
              }} 
            />
            <Stack.Screen 
              name="NewTemplate" 
              component={NewTemplateScreen} 
              options={{ 
                title: 'New Template',
                headerStyle: {
                  backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  fontWeight: '600',
                },
                presentation: 'modal',
              }} 
            />
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Create Account' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
