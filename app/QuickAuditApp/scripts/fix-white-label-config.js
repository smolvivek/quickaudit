/**
 * Script to fix TypeScript errors in WhiteLabelConfig.ts
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

// Fix WhiteLabelConfig.ts
const fixWhiteLabelConfig = () => {
  const dirPath = path.join(process.cwd(), 'src/features/whitelabel');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * White Label Configuration
 * Allows enterprise customers to customize the app with their branding
 */

import { appTheme } from '../../theme/webAppTheme';

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
const defaultConfig: WhiteLabelConfig = {
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

class WhiteLabelConfigManager {
  private config: WhiteLabelConfig;
  
  constructor() {
    // In a real app, this would load from storage or API
    this.config = { ...defaultConfig };
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
    this.config = { ...defaultConfig };
    
    // In a real app, this would save to storage or API
    this.saveConfig();
  }
  
  // Save configuration (mock implementation)
  private saveConfig(): void {
    console.log('Saving white label configuration:', this.config);
    // In a real app, this would save to AsyncStorage or make an API call
  }
  
  // Check if white labeling is enabled
  isEnabled(): boolean {
    return this.config.enabled;
  }
  
  // Get theme colors based on white label config
  getThemeColors() {
    if (!this.isEnabled()) {
      return {
        primary: appTheme.colors.primary,
        secondary: appTheme.colors.secondary,
        accent: appTheme.colors.accent
      };
    }
    
    return {
      primary: this.config.primaryColor,
      secondary: this.config.secondaryColor,
      accent: this.config.accentColor
    };
  }
  
  // Get company name (either white label or default)
  getCompanyName(): string {
    return this.isEnabled() ? this.config.companyName : 'QuickAudit';
  }
  
  // Get logo URL (either white label or default)
  getLogoUrl(): string | null {
    return this.isEnabled() ? this.config.logoUrl : null;
  }
  
  // Get contact information
  getContactInfo() {
    return {
      email: this.isEnabled() ? this.config.contactEmail : 'support@quickaudit.com',
      phone: this.isEnabled() ? this.config.contactPhone : '+1-800-AUDIT'
    };
  }
  
  // Get legal URLs
  getLegalUrls() {
    return {
      terms: this.isEnabled() ? this.config.termsUrl : 'https://quickaudit.com/terms',
      privacy: this.isEnabled() ? this.config.privacyUrl : 'https://quickaudit.com/privacy'
    };
  }
}

export default new WhiteLabelConfigManager();`;

  fs.writeFileSync(path.join(dirPath, 'WhiteLabelConfig.ts'), content, 'utf8');
  console.log('Fixed WhiteLabelConfig.ts');
};

// Run the function
console.log('Fixing WhiteLabelConfig...');
fixWhiteLabelConfig();
console.log('WhiteLabelConfig fixed successfully!');
