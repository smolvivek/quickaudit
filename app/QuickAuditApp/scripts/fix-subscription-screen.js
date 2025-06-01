/**
 * Script to fix TypeScript errors in the SubscriptionScreen
 */

const fs = require('fs');
const path = require('path');

// Fix SubscriptionScreen.tsx
const fixSubscriptionScreen = () => {
  const content = `/**
 * Subscription Screen
 * Allows users to select and manage their subscription plan
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Surface, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { appTheme } from '../theme/webAppTheme';
import { PaymentGateway, PaymentProvider } from '../features/payment/PaymentGateway';

// Subscription plan types
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

// Subscription plans data
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Basic',
    price: 9.99,
    billingCycle: 'monthly',
    features: [
      'Up to 10 audits per month',
      'Basic reporting',
      'Email support',
      'Single user'
    ]
  },
  {
    id: 'professional-monthly',
    name: 'Professional',
    price: 29.99,
    billingCycle: 'monthly',
    features: [
      'Unlimited audits',
      'Advanced reporting',
      'Priority support',
      'Up to 5 users',
      'Data analytics',
      'Export to PDF/Excel'
    ],
    isPopular: true
  },
  {
    id: 'enterprise-monthly',
    name: 'Enterprise',
    price: 99.99,
    billingCycle: 'monthly',
    features: [
      'Unlimited audits',
      'Custom reporting',
      'Dedicated support',
      'Unlimited users',
      'Advanced analytics',
      'White labeling',
      'API access',
      'Custom integrations'
    ]
  },
  {
    id: 'basic-yearly',
    name: 'Basic',
    price: 99.99,
    billingCycle: 'yearly',
    features: [
      'Up to 10 audits per month',
      'Basic reporting',
      'Email support',
      'Single user',
      '2 months free'
    ]
  },
  {
    id: 'professional-yearly',
    name: 'Professional',
    price: 299.99,
    billingCycle: 'yearly',
    features: [
      'Unlimited audits',
      'Advanced reporting',
      'Priority support',
      'Up to 5 users',
      'Data analytics',
      'Export to PDF/Excel',
      '2 months free'
    ],
    isPopular: true
  },
  {
    id: 'enterprise-yearly',
    name: 'Enterprise',
    price: 999.99,
    billingCycle: 'yearly',
    features: [
      'Unlimited audits',
      'Custom reporting',
      'Dedicated support',
      'Unlimited users',
      'Advanced analytics',
      'White labeling',
      'API access',
      'Custom integrations',
      '2 months free'
    ]
  }
];

// Subscription Screen Component
const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<string | null>(null);

  // Filter plans by billing cycle
  const filteredPlans = subscriptionPlans.filter(plan => plan.billingCycle === selectedCycle);

  // Load current subscription
  useEffect(() => {
    // In a real app, this would be an API call to get the user's current subscription
    // For now, we'll simulate having a subscription
    setCurrentSubscription('professional-monthly');
  }, []);

  // Handle plan selection
  const selectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  // Handle subscription purchase
  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, this would call the payment gateway
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription
      setCurrentSubscription(selectedPlan.id);
      
      // Show success message
      Alert.alert(
        'Success',
        \`You are now subscribed to the \${selectedPlan.name} plan.\`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render subscription plan card
  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isCurrentPlan = currentSubscription === plan.id;
    const isSelected = selectedPlan?.id === plan.id;
    
    return (
      <TouchableOpacity
        key={plan.id}
        onPress={() => selectPlan(plan)}
        style={styles.planCardContainer}
        disabled={isCurrentPlan}
      >
        <Card
          style={[
            styles.planCard,
            isSelected && styles.selectedPlanCard,
            isCurrentPlan && styles.currentPlanCard,
            plan.isPopular && styles.popularPlanCard
          ]}
        >
          {plan.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
            </View>
          )}
          
          <Card.Content>
            <Title style={styles.planTitle}>{plan.name}</Title>
            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <Text style={styles.priceText}>{plan.price}</Text>
              <Text style={styles.billingCycleText}>/{plan.billingCycle}</Text>
            </View>
            
            {isCurrentPlan && (
              <View style={styles.currentPlanBadge}>
                <Text style={styles.currentPlanText}>CURRENT PLAN</Text>
              </View>
            )}
            
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureText}>✓ {feature}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            {isCurrentPlan ? (
              <Button mode="outlined" disabled>
                Current Plan
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={() => selectPlan(plan)}
                style={styles.selectButton}
              >
                Select Plan
              </Button>
            )}
          </Card.Actions>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cycleToggleContainer}>
        <TouchableOpacity
          style={[
            styles.cycleToggleButton,
            selectedCycle === 'monthly' && styles.selectedCycleButton
          ]}
          onPress={() => setSelectedCycle('monthly')}
        >
          <Text style={[
            styles.cycleToggleText,
            selectedCycle === 'monthly' && styles.selectedCycleText
          ]}>
            Monthly
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.cycleToggleButton,
            selectedCycle === 'yearly' && styles.selectedCycleButton
          ]}
          onPress={() => setSelectedCycle('yearly')}
        >
          <Text style={[
            styles.cycleToggleText,
            selectedCycle === 'yearly' && styles.selectedCycleText
          ]}>
            Yearly (Save 16%)
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.plansContainer}>
          {filteredPlans.map(plan => renderPlanCard(plan))}
        </View>
      </ScrollView>
      
      {selectedPlan && selectedPlan.id !== currentSubscription && (
        <View style={styles.subscribeContainer}>
          <Button
            mode="contained"
            onPress={handleSubscribe}
            style={styles.subscribeButton}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Processing...' : \`Subscribe to \${selectedPlan.name}\`}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cycleToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cycleToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  selectedCycleButton: {
    backgroundColor: appTheme.colors.primary,
  },
  cycleToggleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedCycleText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  plansContainer: {
    padding: 16,
  },
  planCardContainer: {
    marginBottom: 16,
  },
  planCard: {
    elevation: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: appTheme.colors.primary,
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: appTheme.colors.accent,
  },
  popularPlanCard: {
    borderWidth: 2,
    borderColor: appTheme.colors.secondary,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: appTheme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  priceText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  billingCycleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  currentPlanBadge: {
    backgroundColor: appTheme.colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  currentPlanText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  cardActions: {
    justifyContent: 'center',
    paddingBottom: 16,
  },
  selectButton: {
    width: '80%',
  },
  subscribeContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  subscribeButton: {
    height: 50,
    justifyContent: 'center',
  },
});

export default SubscriptionScreen;`;

  fs.writeFileSync(path.join(process.cwd(), 'src/screens/SubscriptionScreen.tsx'), content, 'utf8');
  console.log('Fixed SubscriptionScreen.tsx');
};

// Run the fix
fixSubscriptionScreen();
console.log('SubscriptionScreen.tsx has been fixed successfully!');
