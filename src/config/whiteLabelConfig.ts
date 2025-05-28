export interface WhiteLabelConfig {
  // Branding
  brandName: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  
  // UI Customization
  theme: {
    darkMode: boolean;
    fontFamily: string;
    borderRadius: number;
    spacing: {
      small: number;
      medium: number;
      large: number;
    };
  };
  
  // Features
  features: {
    auditManagement: boolean;
    findingManagement: boolean;
    subscription: boolean;
    notifications: boolean;
    analytics: boolean;
  };
  
  // Authentication
  auth: {
    providers: string[];
    socialLogin: boolean;
    passwordRequirements: {
      minLength: number;
      requireSpecialChar: boolean;
      requireNumber: boolean;
    };
  };
  
  // Audit Settings
  audit: {
    maxFindings: number;
    maxAttachments: number;
    attachmentSizeLimit: number;
    allowedFileTypes: string[];
  };
  
  // Subscription Plans
  subscription: {
    plans: {
      name: string;
      price: number;
      features: string[];
    }[];
    trialPeriod: number;
    billingIntervals: string[];
  };
}

export const defaultWhiteLabelConfig: WhiteLabelConfig = {
  brandName: 'QuickAudit',
  logo: 'assets/logo.png',
  colors: {
    primary: '#2F80ED',
    secondary: '#1B2A4E',
    background: '#FFFFFF',
    text: '#1B2A4E',
    accent: '#FF6B6B',
  },
  
  theme: {
    darkMode: true,
    fontFamily: 'Inter',
    borderRadius: 12,
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
  },
  
  features: {
    auditManagement: true,
    findingManagement: true,
    subscription: true,
    notifications: true,
    analytics: true,
  },
  
  auth: {
    providers: ['email', 'google', 'facebook'],
    socialLogin: true,
    passwordRequirements: {
      minLength: 8,
      requireSpecialChar: true,
      requireNumber: true,
    },
  },
  
  audit: {
    maxFindings: 50,
    maxAttachments: 10,
    attachmentSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'docx'],
  },
  
  subscription: {
    plans: [
      {
        name: 'Basic',
        price: 9.99,
        features: [
          'Up to 5 users',
          '50 audits per month',
          'Basic reporting',
          'Email support'
        ],
      },
      {
        name: 'Professional',
        price: 29.99,
        features: [
          'Up to 20 users',
          'Unlimited audits',
          'Advanced reporting',
          'Priority support',
          'Custom templates'
        ],
      },
    ],
    trialPeriod: 7,
    billingIntervals: ['month', 'year'],
  },
};
