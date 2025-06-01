/**
 * Script to fix TypeScript errors in SubscriptionManager.ts
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

// Fix SubscriptionManager.ts
const fixSubscriptionManager = () => {
  const dirPath = path.join(process.cwd(), 'src/features/subscription');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Subscription Manager
 * Manages user subscriptions and feature access
 */

import { Alert } from 'react-native';

// Subscription tiers
export enum SubscriptionTier {
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

// Feature flags for each subscription tier
export interface FeatureFlags {
  maxAudits: number;
  maxUsers: number;
  customTemplates: boolean;
  advancedReporting: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  whiteLabelBranding: boolean;
  offlineAccess: boolean;
  dataExport: boolean;
  teamCollaboration: boolean;
}

// Subscription plan details
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: FeatureFlags;
  description: string;
}

// User subscription details
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
}

// Subscription plans
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_basic_monthly',
    name: 'Basic Plan',
    tier: SubscriptionTier.BASIC,
    price: 9.99,
    billingCycle: 'monthly',
    features: {
      maxAudits: 10,
      maxUsers: 2,
      customTemplates: false,
      advancedReporting: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabelBranding: false,
      offlineAccess: true,
      dataExport: false,
      teamCollaboration: false
    },
    description: 'Perfect for individuals or small businesses just getting started with audits.'
  },
  {
    id: 'plan_basic_annual',
    name: 'Basic Plan (Annual)',
    tier: SubscriptionTier.BASIC,
    price: 99.99,
    billingCycle: 'annual',
    features: {
      maxAudits: 10,
      maxUsers: 2,
      customTemplates: false,
      advancedReporting: false,
      apiAccess: false,
      prioritySupport: false,
      whiteLabelBranding: false,
      offlineAccess: true,
      dataExport: false,
      teamCollaboration: false
    },
    description: 'Perfect for individuals or small businesses just getting started with audits.'
  },
  {
    id: 'plan_professional_monthly',
    name: 'Professional Plan',
    tier: SubscriptionTier.PROFESSIONAL,
    price: 29.99,
    billingCycle: 'monthly',
    features: {
      maxAudits: 50,
      maxUsers: 10,
      customTemplates: true,
      advancedReporting: true,
      apiAccess: false,
      prioritySupport: true,
      whiteLabelBranding: false,
      offlineAccess: true,
      dataExport: true,
      teamCollaboration: true
    },
    description: 'Ideal for growing businesses that need more advanced features and team collaboration.'
  },
  {
    id: 'plan_professional_annual',
    name: 'Professional Plan (Annual)',
    tier: SubscriptionTier.PROFESSIONAL,
    price: 299.99,
    billingCycle: 'annual',
    features: {
      maxAudits: 50,
      maxUsers: 10,
      customTemplates: true,
      advancedReporting: true,
      apiAccess: false,
      prioritySupport: true,
      whiteLabelBranding: false,
      offlineAccess: true,
      dataExport: true,
      teamCollaboration: true
    },
    description: 'Ideal for growing businesses that need more advanced features and team collaboration.'
  },
  {
    id: 'plan_enterprise_monthly',
    name: 'Enterprise Plan',
    tier: SubscriptionTier.ENTERPRISE,
    price: 99.99,
    billingCycle: 'monthly',
    features: {
      maxAudits: 1000,
      maxUsers: 100,
      customTemplates: true,
      advancedReporting: true,
      apiAccess: true,
      prioritySupport: true,
      whiteLabelBranding: true,
      offlineAccess: true,
      dataExport: true,
      teamCollaboration: true
    },
    description: 'Complete solution for large organizations with advanced needs and custom branding.'
  },
  {
    id: 'plan_enterprise_annual',
    name: 'Enterprise Plan (Annual)',
    tier: SubscriptionTier.ENTERPRISE,
    price: 999.99,
    billingCycle: 'annual',
    features: {
      maxAudits: 1000,
      maxUsers: 100,
      customTemplates: true,
      advancedReporting: true,
      apiAccess: true,
      prioritySupport: true,
      whiteLabelBranding: true,
      offlineAccess: true,
      dataExport: true,
      teamCollaboration: true
    },
    description: 'Complete solution for large organizations with advanced needs and custom branding.'
  }
];

// Mock current user subscription
const mockUserSubscription: UserSubscription = {
  id: 'sub_123456',
  userId: 'user_123',
  planId: 'plan_professional_monthly',
  tier: SubscriptionTier.PROFESSIONAL,
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  autoRenew: true,
  paymentMethod: 'card_visa_1234',
  status: 'active'
};

class SubscriptionManager {
  private currentSubscription: UserSubscription;
  private availablePlans: SubscriptionPlan[];
  
  constructor() {
    // In a real app, this would fetch the user's subscription from the API
    this.currentSubscription = mockUserSubscription;
    this.availablePlans = subscriptionPlans;
  }
  
  // Get the current subscription
  getCurrentSubscription(): UserSubscription {
    return this.currentSubscription;
  }
  
  // Get all available subscription plans
  getAvailablePlans(): SubscriptionPlan[] {
    return this.availablePlans;
  }
  
  // Get plans by billing cycle
  getPlansByBillingCycle(cycle: 'monthly' | 'annual'): SubscriptionPlan[] {
    return this.availablePlans.filter(plan => plan.billingCycle === cycle);
  }
  
  // Get plan by ID
  getPlanById(planId: string): SubscriptionPlan | undefined {
    return this.availablePlans.find(plan => plan.id === planId);
  }
  
  // Get current plan
  getCurrentPlan(): SubscriptionPlan | undefined {
    return this.getPlanById(this.currentSubscription.planId);
  }
  
  // Check if a feature is available in the current subscription
  hasFeature(featureName: keyof FeatureFlags): boolean {
    const currentPlan = this.getCurrentPlan();
    if (!currentPlan) return false;
    
    return currentPlan.features[featureName];
  }
  
  // Check if user can create more audits
  canCreateAudit(currentAuditCount: number): boolean {
    const currentPlan = this.getCurrentPlan();
    if (!currentPlan) return false;
    
    return currentAuditCount < currentPlan.features.maxAudits;
  }
  
  // Check if user can add more team members
  canAddUser(currentUserCount: number): boolean {
    const currentPlan = this.getCurrentPlan();
    if (!currentPlan) return false;
    
    return currentUserCount < currentPlan.features.maxUsers;
  }
  
  // Upgrade subscription
  upgradeSubscription(newPlanId: string): Promise<boolean> {
    return new Promise((resolve) => {
      // In a real app, this would call the API to upgrade the subscription
      setTimeout(() => {
        const newPlan = this.getPlanById(newPlanId);
        if (!newPlan) {
          Alert.alert('Error', 'Invalid plan selected');
          resolve(false);
          return;
        }
        
        this.currentSubscription = {
          ...this.currentSubscription,
          planId: newPlanId,
          tier: newPlan.tier
        };
        
        resolve(true);
      }, 1000);
    });
  }
  
  // Cancel subscription
  cancelSubscription(): Promise<boolean> {
    return new Promise((resolve) => {
      // In a real app, this would call the API to cancel the subscription
      setTimeout(() => {
        this.currentSubscription = {
          ...this.currentSubscription,
          autoRenew: false,
          status: 'canceled'
        };
        
        resolve(true);
      }, 1000);
    });
  }
  
  // Update payment method
  updatePaymentMethod(paymentMethodId: string): Promise<boolean> {
    return new Promise((resolve) => {
      // In a real app, this would call the API to update the payment method
      setTimeout(() => {
        this.currentSubscription = {
          ...this.currentSubscription,
          paymentMethod: paymentMethodId
        };
        
        resolve(true);
      }, 1000);
    });
  }
}

export default new SubscriptionManager();`;

  fs.writeFileSync(path.join(dirPath, 'SubscriptionManager.ts'), content, 'utf8');
  console.log('Fixed SubscriptionManager.ts');
};

// Run the function
console.log('Fixing SubscriptionManager...');
fixSubscriptionManager();
console.log('SubscriptionManager fixed successfully!');
