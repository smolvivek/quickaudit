import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type MainStackParamList = {
  Home: undefined;
  AuditDetails: { id: string };
  CreateAudit: undefined;
  AddFinding: { auditId: string };
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
  Loading: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  AuditList: undefined;
  AuditDetail: { auditId: string };
  AuditCreation: undefined;
  Profile: undefined;
  AboutUs: undefined;
  ContactUs: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  RefundPolicy: undefined;
  Subscription: undefined;
  SubscriptionDetails: undefined;
  PaymentMethod: undefined;
};

export type NavigationProp = NavigatorScreenParams<RootStackParamList>; 