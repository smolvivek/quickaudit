import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubscription } from '../redux/slices/subscriptionSlice';
import { initStripe, presentPaymentSheet } from '@stripe/stripe-react-native';
import { apiService } from './apiService';

// Stripe publishable key - in a real app, this would be environment-specific
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51HxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxOT';

const StripeWrapper = ({ children }) => {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.quickaudit" // For Apple Pay
    >
      {children}
    </StripeProvider>
  );
};

class PaymentService {
  constructor() {
    this.stripeInitialized = false;
  }

  async initialize() {
    try {
      // Get publishable key from backend
      const { publishableKey } = await apiService.get('/config/stripe');
      
      // Initialize Stripe
      await initStripe({
        publishableKey,
        merchantIdentifier: 'merchant.com.quickaudit',
        urlScheme: 'quickaudit'
      });
      
      this.stripeInitialized = true;
    } catch (error) {
      console.error('Stripe initialization error:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const response = await apiService.post('/payments/create-intent', {
        amount,
        currency
      });
      
      return response.data;
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw error;
    }
  }

  async processPayment(paymentIntent) {
    try {
      if (!this.stripeInitialized) {
        await this.initialize();
      }

      const { error } = await presentPaymentSheet({
        clientSecret: paymentIntent.clientSecret,
        merchantDisplayName: 'QuickAudit'
      });

      if (error) {
        Alert.alert('Payment failed', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      Alert.alert('Payment Error', 'An unexpected error occurred. Please try again.');
      return false;
    }
  }

  async handleSubscription(planId) {
    try {
      // Create subscription on backend
      const { subscription } = await apiService.post('/subscriptions/create', {
        planId
      });

      // Process payment for subscription
      const success = await this.processPayment(subscription.paymentIntent);

      if (success) {
        // Update user's subscription status
        await apiService.post('/subscriptions/activate', {
          subscriptionId: subscription.id
        });
      }

      return success;
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Subscription Error', 'Failed to process subscription. Please try again.');
      return false;
    }
  }
}

export const paymentService = new PaymentService();

// Hook to manage subscription
export const useSubscription = () => {
  const dispatch = useDispatch();
  const subscription = useSelector(state => state.subscription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Subscribe to plan
  const subscribeToPlan = async (planId, paymentMethodId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await paymentService.handleSubscription(planId);
      
      if (!response) {
        throw new Error('Subscription processing failed');
      }
      
      // Get plan details
      // In a real implementation, this would come from your backend
      const planDetails = {
        basic: {
          id: 'basic',
          name: 'Basic',
          price: 9.99,
          interval: 'month'
        },
        professional: {
          id: 'professional',
          name: 'Professional',
          price: 29.99,
          interval: 'month'
        },
        enterprise: {
          id: 'enterprise',
          name: 'Enterprise',
          price: 99.99,
          interval: 'month'
        }
      }[planId];
      
      // Update subscription in Redux
      dispatch(updateSubscription({
        plan: planDetails,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Subscribe to plan error:', error);
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, you would use the actual subscription ID
      const subscriptionId = 'sub_mock';
      
      const response = await paymentService.cancelSubscription(subscriptionId);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      // Update subscription in Redux
      dispatch(updateSubscription({
        status: 'canceled'
      }));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  // Start free trial
  const startFreeTrial = async (planId) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call your backend to start a trial
      // For now, we'll simulate a successful response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get plan details
      // In a real implementation, this would come from your backend
      const planDetails = {
        basic: {
          id: 'basic',
          name: 'Basic',
          price: 9.99,
          interval: 'month'
        },
        professional: {
          id: 'professional',
          name: 'Professional',
          price: 29.99,
          interval: 'month'
        },
        enterprise: {
          id: 'enterprise',
          name: 'Enterprise',
          price: 99.99,
          interval: 'month'
        }
      }[planId];
      
      // Update subscription in Redux
      dispatch(updateSubscription({
        plan: planDetails,
        status: 'trial',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      }));
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Start free trial error:', error);
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  return {
    subscription,
    loading,
    error,
    subscribeToPlan,
    cancelSubscription,
    startFreeTrial
  };
};

export { StripeWrapper, paymentService };
