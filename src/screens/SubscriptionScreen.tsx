import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubscription } from '../redux/slices/subscriptionSlice';
import { Card, Button, Divider, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  recommended?: boolean;
}

interface SubscriptionState {
  activePlan: SubscriptionPlan | null;
  status: string;
  nextBillingDate: string;
  trialEnd: string | null;
}

interface UserState {
  id: string;
  email: string;
  name: string;
}

interface RootState {
  subscription: SubscriptionState;
  auth: {
    user: UserState | null;
  };
}

interface SubscriptionScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ navigation }) => {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const subscription = useSelector((state: RootState) => state.subscription);
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/subscriptions/plans`);
      const data = await response.json();
      setPlans(data.plans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      Alert.alert('Error', 'Failed to fetch subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (plan: SubscriptionPlan) => {
    try {
      setLoading(true);
      
      // Create payment intent on backend
      const response = await fetch(`${API_URL}/subscriptions/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          customerId: user?.id,
        }),
      });

      const { clientSecret, subscriptionId } = await response.json();

      // Confirm payment
      const { error } = await stripe.confirmPaymentIntent({
        clientSecret,
        paymentMethodType: 'Card',
      });

      if (error) {
        throw error;
      }

      // Update subscription in Redux
      dispatch(updateSubscription({
        activePlan: plan,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        trialEnd: null,
      }));

      Alert.alert('Success', 'Subscription updated successfully');
      navigation.navigate('SubscriptionSuccess');
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlan = (plan: SubscriptionPlan) => (
    <Card
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan?.id === plan.id && styles.selectedPlanCard,
      ]}
      onPress={() => setSelectedPlan(plan)}
    >
      {plan.recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Recommended</Text>
        </View>
      )}
      <Card.Content>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.price}>${plan.price.toFixed(2)}/month</Text>
        <Divider style={styles.divider} />
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.feature}>
              <Icon name="check" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => handlePayment(plan)}
          disabled={loading || selectedPlan?.id !== plan.id}
        >
          {selectedPlan?.id === plan.id ? 'Select Plan' : 'Select'}
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription Plans</Text>
        <Text style={styles.subtitle}>
          Choose the plan that best fits your needs
        </Text>
      </View>
      <View style={styles.plansContainer}>
        {plans.map((plan) => renderPlan(plan))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  plansContainer: {
    padding: 16,
  },
  planCard: {
    marginBottom: 16,
    elevation: 2,
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    padding: 8,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
  },
  recommendedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    color: '#666',
  },
});

export default SubscriptionScreen;
