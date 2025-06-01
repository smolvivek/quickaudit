import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Card, Button, List, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {addBillingRecord} from '../redux/slices/subscriptionSlice';

const BillingHistoryScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const subscription = useSelector(state => state.subscription);
  const [loading, setLoading] = useState(false);

  // Load billing history
  useEffect(() => {
    const loadBillingHistory = async () => {
      try {
        setLoading(true);

        // In a real implementation, this would fetch from your backend
        // For now, we'll use mock data if none exists
        if (subscription.billingHistory.length === 0) {
          // Add some mock billing records for demonstration
          const mockRecords = [
            {
              id: 'inv_001',
              date: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000,
              ).toISOString(), // 30 days ago
              amount: subscription.plan?.price || 29.99,
              status: 'paid',
              description: `${
                subscription.plan?.name || 'Professional'
              } Plan - Monthly Subscription`,
            },
            {
              id: 'inv_002',
              date: new Date().toISOString(), // Today
              amount: subscription.plan?.price || 29.99,
              status: 'paid',
              description: `${
                subscription.plan?.name || 'Professional'
              } Plan - Monthly Subscription`,
            },
          ];

          // Add mock records to Redux
          mockRecords.forEach(record => {
            dispatch(addBillingRecord(record));
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Load billing history error:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load billing history');
      }
    };

    loadBillingHistory();
  }, []);

  // Format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Render payment method
  const renderPaymentMethod = () => {
    if (!subscription.paymentMethod) {
      return (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Payment Method</Text>
            <Text style={styles.noPaymentText}>No payment method on file</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('PaymentMethod')}
              style={styles.addButton}>
              Add Payment Method
            </Button>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <View style={styles.paymentMethodContainer}>
            <Icon
              name={getCardIcon(subscription.paymentMethod.brand)}
              size={32}
              color="#1f2937"
              style={styles.cardIcon}
            />
            <View style={styles.paymentMethodDetails}>
              <Text style={styles.paymentMethodText}>
                {subscription.paymentMethod.brand.charAt(0).toUpperCase() +
                  subscription.paymentMethod.brand.slice(1)}{' '}
                ending in {subscription.paymentMethod.last4}
              </Text>
              <Text style={styles.paymentMethodSubtext}>
                Expires {subscription.paymentMethod.expiryMonth}/
                {subscription.paymentMethod.expiryYear}
              </Text>
            </View>
          </View>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('PaymentMethod')}
            style={styles.changeButton}>
            Change
          </Button>
        </Card.Content>
      </Card>
    );
  };

  // Get card icon based on brand
  const getCardIcon = brand => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'credit-card';
      case 'mastercard':
        return 'credit-card';
      case 'amex':
        return 'credit-card';
      case 'discover':
        return 'credit-card';
      default:
        return 'credit-card';
    }
  };

  // Render subscription details
  const renderSubscriptionDetails = () => {
    if (!subscription.plan) {
      return null;
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Current Subscription</Text>
          <View style={styles.subscriptionDetails}>
            <Text style={styles.planName}>{subscription.plan.name} Plan</Text>
            <Text style={styles.planPrice}>
              ${subscription.plan.price}/{subscription.plan.interval}
            </Text>
          </View>

          <Text style={styles.subscriptionStatus}>
            Status:{' '}
            <Text style={getStatusStyle(subscription.status)}>
              {getStatusText(subscription.status)}
            </Text>

          {subscription.status === 'trial' && (
            <Text style={styles.trialText}>
              Trial ends on {formatDate(subscription.trialEnd)}
            </Text>
          )}

          {subscription.status === 'active' && (
            <Text style={styles.renewalText}>
              Next billing date: {formatDate(subscription.endDate)}
            </Text>
          )}

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Subscription')}
            style={styles.manageButton}>
            Manage Subscription
          </Button>
        </Card.Content>
      </Card>
    );
  };

  // Get status text
  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trial':
        return 'Trial';
      case 'expired':
        return 'Expired';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Unknown';
    }
  };

  // Get status style
  const getStatusStyle = status => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'trial':
        return styles.statusTrial;
      case 'expired':
        return styles.statusExpired;
      case 'canceled':
        return styles.statusCanceled;
      default:
        return {};
    }
  };

  // Render billing history
  const renderBillingHistory = () => {
    if (
      !subscription.billingHistory ||
      subscription.billingHistory.length === 0
    ) {
      return (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Billing History</Text>
            <Text style={styles.noHistoryText}>
              No billing history available
            </Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Billing History</Text>

          {subscription.billingHistory.map((record, index) => (
            <View key={record.id}>
              {index > 0 && <Divider style={styles.divider} />}
              <TouchableOpacity
                style={styles.invoiceItem}
                onPress={() => handleViewInvoice(record)}>
                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceDate}>
                    {formatDate(record.date)}
                  </Text>
                  <Text style={styles.invoiceDescription}>
                    {record.description}
                  </Text>
                  <Text style={getInvoiceStatusStyle(record.status)}>
                    {getInvoiceStatusText(record.status)}
                  </Text>
                </View>
                <View style={styles.invoiceAmount}>
                  <Text style={styles.amountText}>
                    ${record.amount.toFixed(2)}
                  </Text>
                  <Icon name="chevron-right" size={20} color="#6b7280" />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  // Get invoice status text
  const getInvoiceStatusText = status => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  // Get invoice status style
  const getInvoiceStatusStyle = status => {
    switch (status) {
      case 'paid':
        return styles.statusPaid;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return {};
    }
  };

  // Handle view invoice
  const handleViewInvoice = invoice => {
    // In a real implementation, this would navigate to an invoice detail screen
    // or open a PDF invoice
    Alert.alert(
      'Invoice Details',
      `Invoice #${invoice.id}\nDate: ${formatDate(
        invoice.date,
      )}\nAmount: $${invoice.amount.toFixed(2)}\nStatus: ${getInvoiceStatusText(
        invoice.status,
      )}\n\n${invoice.description}`,
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Billing & Subscription</Text>

      {renderSubscriptionDetails()}
      {renderPaymentMethod()}
      {renderBillingHistory()}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For billing questions, please contact support@quickaudit.com
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  subscriptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  planPrice: {
    fontSize: 16,
    color: '#1f2937',
  },
  subscriptionStatus: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4b5563',
  },
  statusActive: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  statusTrial: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  statusExpired: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  statusCanceled: {
    color: '#6b7280',
    fontWeight: 'bold',
  },
  trialText: {
    fontSize: 14,
    marginBottom: 16,
    color: '#3b82f6',
  },
  renewalText: {
    fontSize: 14,
    marginBottom: 16,
    color: '#4b5563',
  },
  manageButton: {
    borderColor: '#2563eb',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#1f2937',
  },
  paymentMethodSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  changeButton: {
    borderColor: '#2563eb',
  },
  noPaymentText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2563eb',
  },
  divider: {
    marginVertical: 12,
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  invoiceDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginVertical: 4,
  },
  invoiceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 8,
  },
  statusPaid: {
    color: '#10b981',
  },
  statusPending: {
    color: '#f59e0b',
  },
  statusFailed: {
    color: '#ef4444',
  },
  noHistoryText: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    marginTop: 16,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default BillingHistoryScreen;
