import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../contexts/AuthContext';
import {
  RootStackParamList,
  AuthStackParamList,
  MainStackParamList,
} from './types';
import {LoadingScreen} from '../components/LoadingScreen';

// Auth Screens
// Using default imports to fix TypeScript errors
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

// Main Screens
// Using default imports to fix TypeScript errors
import AuditExecutionScreen from '../screens/AuditExecutionScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
// Import placeholder components for missing screens
import SampleScreen from '../screens/SampleScreen';

// Create placeholder components for screens that don't exist yet or have named exports
const ProfileScreen = () => <LoadingScreen />;
const SettingsScreen = () => <LoadingScreen />;

// Placeholder components for screens that don't exist yet
const SupervisorDashboardScreen = () => <LoadingScreen />;
const ClientDashboardScreen = () => <LoadingScreen />;
const AuditorDashboardScreen = () => <LoadingScreen />;



const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => {
  const {user} = useAuth();

  const getInitialRoute = () => {
    // Define allowed roles as a type to fix TypeScript error
    type UserRole = 'admin' | 'supervisor' | 'auditor' | 'client';
    
    // Cast user.role to UserRole to handle the supervisor case
    const role = user?.role as UserRole;
    
    switch (role) {
      case 'admin':
        return 'AdminDashboard';
      case 'supervisor':
        return 'SupervisorDashboard';
      case 'auditor':
        return 'AuditorDashboard';
      case 'client':
        return 'ClientDashboard';
      default:
        return 'Sample'; // Default to our sample screen for demonstration
    }
  };

  return (
    <MainStack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#3333FF', // Primary blue from web app
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
        },
        headerTintColor: '#FFFFFF', // White text on blue background
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: 18,
        },
      }}>
      <MainStack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{title: 'Admin Dashboard'}}
      />
      <MainStack.Screen
        name="SupervisorDashboard"
        component={SupervisorDashboardScreen}
        options={{title: 'Supervisor Dashboard'}}
      />
      <MainStack.Screen
        name="AuditorDashboard"
        component={AuditorDashboardScreen}
        options={{title: 'Auditor Dashboard'}}
      />
      <MainStack.Screen
        name="ClientDashboard"
        component={ClientDashboardScreen}
        options={{title: 'Client Dashboard'}}
      />
      <MainStack.Screen
        name="AuditExecution"
        component={AuditExecutionScreen}
        options={{title: 'Audit Execution'}}
      />
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
      <MainStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
      <MainStack.Screen
        name="Sample"
        component={SampleScreen}
        options={{title: 'UI Component Guide'}}
      />
    </MainStack.Navigator>
  );
};

export const AppNavigator = () => {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {user ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
