import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, AuthStackParamList, MainStackParamList } from './types';
import { LoadingScreen } from '../components/LoadingScreen';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';

// Main Screens
import { AuditExecutionScreen } from '../screens/AuditExecutionScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { SupervisorDashboardScreen } from '../screens/SupervisorDashboardScreen';
import { ClientDashboardScreen } from '../screens/ClientDashboardScreen';
import { AuditorDashboardScreen } from '../screens/AuditorDashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => {
  const { user } = useAuth();
  
  const getInitialRoute = () => {
    switch (user?.role) {
      case 'admin':
        return 'AdminDashboard';
      case 'supervisor':
        return 'SupervisorDashboard';
      case 'auditor':
        return 'AuditorDashboard';
      case 'client':
        return 'ClientDashboard';
      default:
        return 'Profile';
    }
  };

  return (
    <MainStack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.primary,
      }}
    >
      <MainStack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <MainStack.Screen 
        name="SupervisorDashboard" 
        component={SupervisorDashboardScreen}
        options={{ title: 'Supervisor Dashboard' }}
      />
      <MainStack.Screen 
        name="AuditorDashboard" 
        component={AuditorDashboardScreen}
        options={{ title: 'Auditor Dashboard' }}
      />
      <MainStack.Screen 
        name="ClientDashboard" 
        component={ClientDashboardScreen}
        options={{ title: 'Client Dashboard' }}
      />
      <MainStack.Screen 
        name="AuditExecution" 
        component={AuditExecutionScreen}
        options={{ title: 'Audit Execution' }}
      />
      <MainStack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <MainStack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </MainStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}; 