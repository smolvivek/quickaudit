/**
 * Script to fix whiteLabelConfig.ts TypeScript errors
 */

const fs = require('fs');
const path = require('path');

// Fix whiteLabelConfig.ts
const fixWhiteLabelConfigFile = () => {
  const filePath = path.join(process.cwd(), 'src/config/whiteLabelConfig.ts');
  
  const content = `/**
 * White Label Configuration
 * Allows enterprise customers to customize the app with their branding
 */

import { appTheme } from '../theme';

// White label configuration interface
export interface WhiteLabelConfig {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customCss: string;
  emailTemplate: string;
  reportTemplate: string;
  contactEmail: string;
  contactPhone: string;
  termsUrl: string;
  privacyUrl: string;
  enabled: boolean;
}

// Default configuration
export const whiteLabelConfig: WhiteLabelConfig = {
  companyName: 'QuickAudit',
  logoUrl: null,
  primaryColor: appTheme.colors.primary,
  secondaryColor: appTheme.colors.secondary,
  accentColor: appTheme.colors.accent,
  fontFamily: 'System',
  customCss: '',
  emailTemplate: 'default',
  reportTemplate: 'default',
  contactEmail: 'support@quickaudit.com',
  contactPhone: '+1-800-AUDIT',
  termsUrl: 'https://quickaudit.com/terms',
  privacyUrl: 'https://quickaudit.com/privacy',
  enabled: false
};

// White Label Config Manager
export class WhiteLabelManager {
  private config: WhiteLabelConfig;
  
  constructor(initialConfig: Partial<WhiteLabelConfig> = {}) {
    this.config = { ...whiteLabelConfig, ...initialConfig };
  }
  
  // Get the current configuration
  getConfig(): WhiteLabelConfig {
    return this.config;
  }
  
  // Update the configuration
  updateConfig(newConfig: Partial<WhiteLabelConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // In a real app, this would save to storage or API
    this.saveConfig();
  }
  
  // Reset to default configuration
  resetConfig(): void {
    this.config = { ...whiteLabelConfig };
    
    // In a real app, this would save to storage or API
    this.saveConfig();
  }
  
  // Save configuration (mock implementation)
  private saveConfig(): void {
    console.log('Saving white label configuration:', this.config);
    // In a real app, this would save to AsyncStorage or make an API call
  }
}

// Create and export a default instance
export const whiteLabelManager = new WhiteLabelManager();`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed whiteLabelConfig.ts');
};

// Run the function
console.log('Fixing whiteLabelConfig file...');
fixWhiteLabelConfigFile();
console.log('whiteLabelConfig file fixed successfully!');
