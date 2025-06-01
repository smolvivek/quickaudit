import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Switch, useTheme } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme/designSystem';
import { subscriptionPlans, addonServices } from '../../../backend/src/config/payment';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type PlanType = 'basic' | 'pro' | 'enterprise';
type BillingCycle = 'monthly' | 'annual';
type AddonType = 'customTemplates' | 'prioritySupport' | 'apiAccess';

interface Addons {
  customTemplates: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
}

export const SubscriptionScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { isLoading, error, refreshSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('basic');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [addons, setAddons] = useState<Addons>({
    customTemplates: false,
    prioritySupport: false,
    apiAccess: false
  });

  const calculateTotal = () => {
    const planPrice = subscriptionPlans[selectedPlan][billingCycle];
    let total = planPrice.usd;
    
    if (addons.customTemplates) total += addonServices.customTemplates.usd;
    if (addons.prioritySupport) total += addonServices.prioritySupport.usd;
    if (addons.apiAccess) total += addonServices.apiAccess.usd;
    
    return total;
  };

  const handleSubscribe = async () => {
    try {
      // TODO: Implement subscription logic
      // 1. Check if user has payment methods
      // 2. If not, navigate to add payment method
      // 3. Process payment
      // 4. Create subscription
      navigation.navigate('PaymentMethod');
    } catch (error) {
      console.error('Error subscribing:', error);
      // Handle error
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="titleLarge" style={styles.errorText}>
          {error}
        </Text>
        <Button
          mode="contained"
          onPress={refreshSubscription}
          style={styles.retryButton}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Choose Your Plan
      </Text>

      {/* Billing Cycle Toggle */}
      <View style={styles.billingToggle}>
        <Button
          mode={billingCycle === 'monthly' ? 'contained' : 'outlined'}
          onPress={() => setBillingCycle('monthly')}
        >
          Monthly
        </Button>
        <Button
          mode={billingCycle === 'annual' ? 'contained' : 'outlined'}
          onPress={() => setBillingCycle('annual')}
          style={styles.annualButton}
        >
          Annual (Save 20%)
        </Button>
      </View>

      {/* Plan Cards */}
      <View style={styles.plansContainer}>
        {(Object.entries(subscriptionPlans) as [PlanType, typeof subscriptionPlans[PlanType]][]).map(([plan, prices]) => (
          <Card
            key={plan}
            style={[
              styles.planCard,
              selectedPlan === plan && styles.selectedPlan
            ]}
            onPress={() => setSelectedPlan(plan)}
          >
            <Card.Content>
              <Text variant="titleLarge" style={styles.planName}>
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </Text>
              <Text variant="headlineMedium" style={styles.price}>
                ${prices[billingCycle].usd}
                <Text variant="bodyMedium">/month</Text>
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {plan === 'basic' && 'Perfect for small teams'}
                {plan === 'pro' && 'Ideal for growing businesses'}
                {plan === 'enterprise' && 'For large organizations'}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Add-ons */}
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Add-ons
      </Text>
      <Card style={styles.addonsCard}>
        <Card.Content>
          {(Object.entries(addonServices) as [AddonType, typeof addonServices[AddonType]][]).map(([addon, price]) => (
            <View key={addon} style={styles.addonItem}>
              <View>
                <Text variant="titleMedium">
                  {addon.split(/(?=[A-Z])/).join(' ')}
                </Text>
                <Text variant="bodyMedium" style={styles.addonPrice}>
                  +${price.usd}/month
                </Text>
              </View>
              <Switch
                value={addons[addon]}
                onValueChange={(value) =>
                  setAddons(prev => ({ ...prev, [addon]: value }))
                }
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Total and Subscribe Button */}
      <Card style={styles.totalCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.totalLabel}>
            Total per month
          </Text>
          <Text variant="headlineLarge" style={styles.totalAmount}>
            ${calculateTotal()}
          </Text>
          <Button
            mode="contained"
            onPress={handleSubscribe}
            style={styles.subscribeButton}
          >
            Subscribe Now
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.error.main,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  billingToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  annualButton: {
    marginLeft: spacing.sm,
  },
  plansContainer: {
    marginBottom: spacing.lg,
  },
  planCard: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.grey[300],
  },
  selectedPlan: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  planName: {
    marginBottom: spacing.xs,
  },
  price: {
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.text.secondary,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  addonsCard: {
    marginBottom: spacing.lg,
  },
  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  addonPrice: {
    color: colors.text.secondary,
  },
  totalCard: {
    marginBottom: spacing.xl,
  },
  totalLabel: {
    color: colors.text.secondary,
  },
  totalAmount: {
    color: colors.primary.main,
    marginVertical: spacing.sm,
  },
  subscribeButton: {
    marginTop: spacing.md,
  },
}); 