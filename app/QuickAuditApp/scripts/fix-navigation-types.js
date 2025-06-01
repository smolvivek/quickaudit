/**
 * Script to fix TypeScript errors in navigation/types.ts
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Fix navigation/types.ts
const fixNavigationTypes = () => {
  const dirPath = path.join(process.cwd(), 'src/navigation');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Navigation types for the application
 */

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Audits: undefined;
  Reports: undefined;
  Settings: undefined;
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
};`;

  fs.writeFileSync(path.join(dirPath, 'types.ts'), content, 'utf8');
  console.log('Fixed navigation/types.ts');
};

// Run the function
console.log('Fixing navigation types...');
fixNavigationTypes();
console.log('Navigation types fixed successfully!');
