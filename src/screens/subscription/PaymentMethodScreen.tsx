import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Switch, useTheme } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme/designSystem';
import { useSubscription } from '../../contexts/SubscriptionContext';

export const PaymentMethodScreen = () => {
  const theme = useTheme();
  const {
    paymentMethods,
    isLoading,
    error,
    refreshSubscription,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  } = useSubscription();

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

  const renderPaymentMethod = (method: typeof paymentMethods[0]) => {
    if (method.type === 'card') {
      return (
        <Card key={method.id} style={styles.methodCard}>
          <Card.Content>
            <View style={styles.methodHeader}>
              <View style={styles.methodInfo}>
                <Text variant="titleMedium">
                  {method.brand} ending in {method.last4}
                </Text>
                <Text variant="bodyMedium" style={styles.expiryDate}>
                  Expires {method.expiryDate}
                </Text>
              </View>
              <Switch
                value={method.isDefault}
                onValueChange={() => setDefaultPaymentMethod(method.id)}
              />
            </View>
            <Button
              mode="text"
              onPress={() => deletePaymentMethod(method.id)}
              textColor={colors.error.main}
            >
              Remove
            </Button>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card key={method.id} style={styles.methodCard}>
        <Card.Content>
          <View style={styles.methodHeader}>
            <View style={styles.methodInfo}>
              <Text variant="titleMedium">PayPal</Text>
              <Text variant="bodyMedium" style={styles.email}>
                {method.email}
              </Text>
            </View>
            <Switch
              value={method.isDefault}
              onValueChange={() => setDefaultPaymentMethod(method.id)}
            />
          </View>
          <Button
            mode="text"
            onPress={() => deletePaymentMethod(method.id)}
            textColor={colors.error.main}
          >
            Remove
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Payment Methods
      </Text>

      {/* Payment Methods List */}
      <View style={styles.methodsList}>
        {paymentMethods.map(renderPaymentMethod)}
      </View>

      {/* Add New Payment Method */}
      <Card style={styles.addCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.addTitle}>
            Add Payment Method
          </Text>
          <View style={styles.addButtons}>
            <Button
              mode="outlined"
              onPress={() => {/* Handle add card */}}
              style={styles.addButton}
            >
              Add Card
            </Button>
            <Button
              mode="outlined"
              onPress={() => {/* Handle add PayPal */}}
              style={styles.addButton}
            >
              Add PayPal
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Billing Address */}
      <Card style={styles.addressCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.addressTitle}>
            Billing Address
          </Text>
          <Text variant="bodyMedium">
            123 Main Street{'\n'}
            City, State 12345{'\n'}
            United States
          </Text>
          <Button
            mode="text"
            onPress={() => {/* Handle edit address */}}
            style={styles.editButton}
          >
            Edit Address
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
    marginBottom: spacing.lg,
  },
  methodsList: {
    marginBottom: spacing.lg,
  },
  methodCard: {
    marginBottom: spacing.md,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  methodInfo: {
    flex: 1,
  },
  expiryDate: {
    color: colors.text.secondary,
  },
  email: {
    color: colors.text.secondary,
  },
  addCard: {
    marginBottom: spacing.lg,
  },
  addTitle: {
    marginBottom: spacing.md,
  },
  addButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  addressCard: {
    marginBottom: spacing.lg,
  },
  addressTitle: {
    marginBottom: spacing.md,
  },
  editButton: {
    marginTop: spacing.sm,
  },
}); 