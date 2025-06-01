import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

interface Subscription {
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'annual';
  addons: string[];
  nextBillingDate: string;
  amount: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
  expiryDate?: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  updatePaymentMethod: (method: PaymentMethod) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch('/api/subscription');
      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setError('Failed to fetch subscription details');
      console.error('Error fetching subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch('/api/payment-methods');
      const data = await response.json();
      setPaymentMethods(data);
    } catch (err) {
      setError('Failed to fetch payment methods');
      console.error('Error fetching payment methods:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await Promise.all([fetchSubscription(), fetchPaymentMethods()]);
  };

  const updatePaymentMethod = async (method: PaymentMethod) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/payment-methods/${method.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method),
      });
      const data = await response.json();
      setPaymentMethods(prev => prev.map(m => m.id === method.id ? data : m));
    } catch (err) {
      setError('Failed to update payment method');
      console.error('Error updating payment method:', err);
      Alert.alert('Error', 'Failed to update payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' });
      setPaymentMethods(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to delete payment method');
      console.error('Error deleting payment method:', err);
      Alert.alert('Error', 'Failed to delete payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      await fetch(`/api/payment-methods/${id}/default`, { method: 'PUT' });
      setPaymentMethods(prev =>
        prev.map(m => ({ ...m, isDefault: m.id === id }))
      );
    } catch (err) {
      setError('Failed to set default payment method');
      console.error('Error setting default payment method:', err);
      Alert.alert('Error', 'Failed to set default payment method');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshSubscription();
    }
  }, [user]);

  const value = {
    subscription,
    paymentMethods,
    isLoading,
    error,
    refreshSubscription,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 