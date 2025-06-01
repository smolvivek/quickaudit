/**
 * Navigation types for the application
 */

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type MainStackParamList = {
  AdminDashboard: undefined;
  SupervisorDashboard: undefined;
  AuditorDashboard: undefined;
  ClientDashboard: undefined;
  AuditExecution: { auditId?: string };
  Profile: undefined;
  Settings: undefined;
  Sample: undefined; // Added for our sample screen
};

export type AuditStackParamList = {
  AuditList: undefined;
  AuditDetails: { auditId: string };
  CreateAudit: undefined;
  EditAudit: { auditId: string };
  AuditExecution: { auditId: string };
  AddFinding: { auditId: string; sectionId?: string };
  EditFinding: { auditId: string; findingId: string };
  AuditReport: { auditId: string };
};

export type ReportStackParamList = {
  ReportList: undefined;
  ReportDetails: { reportId: string };
  GenerateReport: { auditId: string };
};

export type SettingsStackParamList = {
  SettingsList: undefined;
  Profile: undefined;
  Notifications: undefined;
  WhiteLabelConfig: undefined;
  Subscription: undefined;
  BillingHistory: undefined;
  UserManagement: undefined;
  AdminDashboard: undefined;
};

export type AdminStackParamList = {
  UserList: undefined;
  UserDetails: { userId: string };
  EditUser: { userId: string };
  AddUser: undefined;
  ActivityLog: undefined;
  SystemSettings: undefined;
  AdminActions: undefined;
};

export type ClientStackParamList = {
  ClientDashboard: undefined;
  ClientAudits: undefined;
  ClientReports: undefined;
  ClientSettings: undefined;
};

export type NavigationProps = {
  navigation: any;
  route: any;
};