/**
 * Subscription Context
 * Provides subscription functionality throughout the app
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import SubscriptionManager, { 
  SubscriptionTier, 
  SubscriptionPlan, 
  UserSubscription, 
  FeatureFlags 
} from '../features/subscription/SubscriptionManager';

// Subscription context interface
interface SubscriptionContextType {
  currentSubscription: UserSubscription | null;
  currentPlan: SubscriptionPlan | null;
  availablePlans: SubscriptionPlan[];
  upgradeSubscription: (planId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  hasFeature: (featureName: keyof FeatureFlags) => boolean;
  canCreateAudit: (currentAuditCount: number) => boolean;
  canAddUser: (currentUserCount: number) => boolean;
}

// Create context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  currentSubscription: null,
  currentPlan: null,
  availablePlans: [],
  upgradeSubscription: async () => false,
  cancelSubscription: async () => false,
  hasFeature: () => false,
  canCreateAudit: () => false,
  canAddUser: () => false
});

// Subscription provider component
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(
    SubscriptionManager.getCurrentSubscription()
  );
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(
    SubscriptionManager.getCurrentPlan() || null
  );
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>(
    SubscriptionManager.getAvailablePlans()
  );
  
  // Update subscription data when it changes
  useEffect(() => {
    // In a real app, this would subscribe to subscription changes
    const updateSubscription = () => {
      setCurrentSubscription(SubscriptionManager.getCurrentSubscription());
      setCurrentPlan(SubscriptionManager.getCurrentPlan() || null);
    };
    
    // Simulate subscription to changes
    const intervalId = setInterval(updateSubscription, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Upgrade subscription
  const upgradeSubscription = async (planId: string) => {
    const result = await SubscriptionManager.upgradeSubscription(planId);
    
    if (result) {
      setCurrentSubscription(SubscriptionManager.getCurrentSubscription());
      setCurrentPlan(SubscriptionManager.getCurrentPlan() || null);
    }
    
    return result;
  };
  
  // Cancel subscription
  const cancelSubscription = async () => {
    const result = await SubscriptionManager.cancelSubscription();
    
    if (result) {
      setCurrentSubscription(SubscriptionManager.getCurrentSubscription());
    }
    
    return result;
  };
  
  // Check if a feature is available
  const hasFeature = (featureName: keyof FeatureFlags) => {
    return SubscriptionManager.hasFeature(featureName);
  };
  
  // Check if user can create more audits
  const canCreateAudit = (currentAuditCount: number) => {
    return SubscriptionManager.canCreateAudit(currentAuditCount);
  };
  
  // Check if user can add more team members
  const canAddUser = (currentUserCount: number) => {
    return SubscriptionManager.canAddUser(currentUserCount);
  };
  
  return (
    <SubscriptionContext.Provider
      value={{
        currentSubscription,
        currentPlan,
        availablePlans,
        upgradeSubscription,
        cancelSubscription,
        hasFeature,
        canCreateAudit,
        canAddUser
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Hook for using subscription context
export const useSubscription = () => useContext(SubscriptionContext);

export default SubscriptionContext;