/**
 * Script to fix TypeScript errors in the SubscriptionDetailsScreen
 */

const fs = require('fs');
const path = require('path');

// Fix SubscriptionDetailsScreen.tsx
const fixSubscriptionDetailsScreen = () => {
  const content = `/**
 * Subscription Details Screen
 * Shows details of the user's current subscription and billing history
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Divider, List, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { appTheme } from '../../theme/webAppTheme';

// Subscription details interface
interface SubscriptionDetails {
  plan: string;
  status: 'active' | 'inactive' | 'trial';
  startDate: string;
  endDate: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
  paymentMethod: string;
}

// Billing history item interface
interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
  invoiceUrl?: string;
}

// Sample subscription data
const sampleSubscription: SubscriptionDetails = {
  plan: 'Professional',
  status: 'active',
  startDate: '2023-04-01',
  endDate: '2023-05-01',
  price: 29.99,
  billingCycle: 'monthly',
  autoRenew: true,
  paymentMethod: 'Visa ending in 4242',
};

// Sample billing history
const sampleBillingHistory: BillingHistoryItem[] = [
  {
    id: '1',
    date: '2023-04-01',
    amount: 29.99,
    status: 'paid',
    paymentMethod: 'Visa ending in 4242',
    invoiceUrl: 'https://example.com/invoice/1',
  },
  {
    id: '2',
    date: '2023-03-01',
    amount: 29.99,
    status: 'paid',
    paymentMethod: 'Visa ending in 4242',
    invoiceUrl: 'https://example.com/invoice/2',
  },
  {
    id: '3',
    date: '2023-02-01',
    amount: 29.99,
    status: 'paid',
    paymentMethod: 'Visa ending in 4242',
    invoiceUrl: 'https://example.com/invoice/3',
  },
];

// Subscription Details Screen Component
const SubscriptionDetailsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);

  // Load subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // For now, we'll use sample data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubscription(sampleSubscription);
        setBillingHistory(sampleBillingHistory);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionData();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
        <Text style={styles.loadingText}>Loading subscription details...</Text>
      </View>
    );
  }

  // Render if no subscription found
  if (!subscription) {
    return (
      <View style={styles.noSubscriptionContainer}>
        <Text style={styles.noSubscriptionText}>
          You don't have an active subscription
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
      <Card style={styles.subscriptionCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Current Subscription</Title>
          <View style={styles.planContainer}>
            <Text style={styles.planName}>{subscription.plan}</Text>
            <View style={[
              styles.statusBadge,
              subscription.status === 'active' && styles.activeBadge,
              subscription.status === 'inactive' && styles.inactiveBadge,
              subscription.status === 'trial' && styles.trialBadge,
            ]}>
              <Text style={styles.statusText}>
                {subscription.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>
              ${subscription.price}/{subscription.billingCycle === 'monthly' ? 'month' : 'year'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Period:</Text>
            <Text style={styles.detailValue}>
              {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Auto-Renew:</Text>
            <Text style={styles.detailValue}>
              {subscription.autoRenew ? 'Yes' : 'No'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{subscription.paymentMethod}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Subscription')}
              style={styles.changeButton}
            >
              Change Plan
            </Button>
            <Button
              mode={subscription.autoRenew ? 'outlined' : 'contained'}
              onPress={() => {
                // In a real app, this would call an API to toggle auto-renew
                setSubscription({
                  ...subscription,
                  autoRenew: !subscription.autoRenew,
                });
              }}
              style={styles.renewButton}
            >
              {subscription.autoRenew ? 'Cancel Auto-Renew' : 'Enable Auto-Renew'}
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.billingCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Billing History</Title>
          
          {billingHistory.length === 0 ? (
            <Paragraph style={styles.noBillingText}>
              No billing history available
            </Paragraph>
          ) : (
            billingHistory.map((item) => (
              <List.Item
                key={item.id}
                title={formatDate(item.date)}
                description={item.paymentMethod}
                right={() => (
                  <View style={styles.billingItemRight}>
                    <Text style={styles.billingAmount}>${item.amount.toFixed(2)}</Text>
                    <View style={[
                      styles.billingStatusBadge,
                      item.status === 'paid' && styles.paidBadge,
                      item.status === 'pending' && styles.pendingBadge,
                      item.status === 'failed' && styles.failedBadge,
                    ]}>
                      <Text style={styles.billingStatusText}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                )}
                onPress={() => {
                  // In a real app, this would open the invoice
                  if (item.invoiceUrl) {
                    // Open invoice URL
                    console.log('Opening invoice:', item.invoiceUrl);
                  }
                }}
                style={styles.billingItem}
              />
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  noSubscriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noSubscriptionText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  subscribeButton: {
    width: '80%',
    marginTop: 16,
  },
  subscriptionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#e6f7e6',
  },
  inactiveBadge: {
    backgroundColor: '#ffebee',
  },
  trialBadge: {
    backgroundColor: '#e3f2fd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  changeButton: {
    flex: 1,
    marginRight: 8,
  },
  renewButton: {
    flex: 1,
    marginLeft: 8,
  },
  billingCard: {
    marginBottom: 16,
    elevation: 2,
  },
  noBillingText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  billingItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  billingItemRight: {
    alignItems: 'flex-end',
  },
  billingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  billingStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  paidBadge: {
    backgroundColor: '#e6f7e6',
  },
  pendingBadge: {
    backgroundColor: '#fff8e1',
  },
  failedBadge: {
    backgroundColor: '#ffebee',
  },
  billingStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default SubscriptionDetailsScreen;`;

  fs.writeFileSync(path.join(process.cwd(), 'src/screens/subscription/SubscriptionDetailsScreen.tsx'), content, 'utf8');
  console.log('Fixed SubscriptionDetailsScreen.tsx');
};

// Run the fix
fixSubscriptionDetailsScreen();
console.log('SubscriptionDetailsScreen.tsx has been fixed successfully!');
