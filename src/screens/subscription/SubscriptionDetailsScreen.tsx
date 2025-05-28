import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Divider, useTheme } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme/designSystem';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SubscriptionDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const {
    subscription,
    isLoading,
    error,
    refreshSubscription
  } = useSubscription();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success.main;
      case 'cancelled':
        return colors.error.main;
      case 'expired':
        return colors.warning.main;
      default:
        return colors.text.secondary;
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

  if (!subscription) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleLarge" style={styles.emptyText}>
          No Active Subscription
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Subscription')}
          style={styles.subscribeButton}
        >
          Subscribe Now
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Current Subscription */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Current Subscription
          </Text>
          <View style={styles.subscriptionInfo}>
            <View style={styles.infoRow}>
              <Text variant="bodyLarge">Plan:</Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {subscription.plan}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyLarge">Status:</Text>
              <Text
                variant="bodyLarge"
                style={[styles.infoValue, { color: getStatusColor(subscription.status) }]}
              >
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyLarge">Billing Cycle:</Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyLarge">Next Billing Date:</Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyLarge">Amount:</Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                ${subscription.amount}/month
              </Text>
            </View>
          </View>

          {subscription.addons.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text variant="titleMedium" style={styles.addonsTitle}>
                Active Add-ons
              </Text>
              {subscription.addons.map((addon, index) => (
                <Text key={index} variant="bodyMedium" style={styles.addonItem}>
                  • {addon}
                </Text>
              ))}
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Subscription')}
              style={styles.button}
            >
              Change Plan
            </Button>
            <Button
              mode="outlined"
              onPress={() => {/* Handle cancellation */}}
              style={[styles.button, styles.cancelButton]}
            >
              Cancel Subscription
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Payment Methods */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Payment Methods
          </Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('PaymentMethod')}
            style={styles.button}
          >
            Manage Payment Methods
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subscribeButton: {
    marginTop: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  subscriptionInfo: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoValue: {
    fontWeight: '500',
  },
  divider: {
    marginVertical: spacing.md,
  },
  addonsTitle: {
    marginBottom: spacing.sm,
  },
  addonItem: {
    marginBottom: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  button: {
    marginBottom: spacing.sm,
  },
  cancelButton: {
    borderColor: colors.error.main,
  },
}); 