import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  AuditDetails: { auditId: string };
  AddFinding: { auditId: string };
  EditFinding: { auditId: string; findingId: string };
  FindingDetails: { auditId: string; findingId: string };
  Settings: undefined;
  Profile: undefined;
};

type NavigationContextData = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
  canGoBack: boolean;
  currentRoute: string;
  params: any;
};

const NavigationContext = createContext<NavigationContextData>(
  {} as NavigationContextData
);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, keyof RootStackParamList>>();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const navigate = useCallback(
    (screen: keyof RootStackParamList, params?: any) => {
      if (!isAuthenticated && screen !== 'Login' && screen !== 'Register') {
        showToast('Please sign in to continue', 'warning');
        navigation.navigate('Login');
        return;
      }

      navigation.navigate(screen, params);
    },
    [isAuthenticated, navigation, showToast]
  );

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <NavigationContext.Provider
      value={{
        navigate,
        goBack,
        canGoBack: navigation.canGoBack(),
        currentRoute: route.name,
        params: route.params,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = (): NavigationContextData => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider'
    );
  }

  return context;
}; 