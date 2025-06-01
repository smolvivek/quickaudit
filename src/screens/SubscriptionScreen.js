import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubscription } from '../redux/slices/subscriptionSlice';
import { Card, Button, Divider, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SubscriptionScreen = ({ navigation }) => {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const subscription = useSelector(state => state.subscription);
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch available subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from your backend
        // For now, we'll use mock data
        const mockPlans = [
          {
            id: 'basic',
            name: 'Basic',
            price: 9.99,
            interval: 'month',
            features: [
              'Up to 5 users',
              '50 audits per month',
              'Basic reporting',
              'Email support'
            ],
            recommended: false
          },
          {
            id: 'professional',
            name: 'Professional',
            price: 29.99,
            interval: 'month',
            features: [
              'Up to 20 users',
              'Unlimited audits',
              'Advanced reporting',
              'Priority email support',
              'Custom audit templates'
            ],
            recommended: true
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99.99,
            interval: 'month',
            features: [
              'Unlimited users',
              'Unlimited audits',
              'Advanced analytics',
              'Dedicated support',
              'Custom integrations',
              'White labeling'
            ],
            recommended: false
          }
        ];
        
        setPlans(mockPlans);
        
        // Set current plan as selected if exists
        if (subscription.plan) {
          const currentPlan = mockPlans.find(p => p.id === subscription.plan.id);
          if (currentPlan) {
            setSelectedPlan(currentPlan);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load subscription plans');
      }
    };
    
    fetchPlans();
  }, [subscription.plan]);

  // Handle subscription purchase
  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real implementation, this would create a payment intent on your backend
      // and return client secret
      // For now, we'll simulate a successful subscription
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update subscription in Redux
      dispatch(updateSubscription({
        plan: selectedPlan,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }));
      
      setLoading(false);
      
      Alert.alert(
        'Subscription Activated',
        `You are now subscribed to the ${selectedPlan.name} plan!`,
        [
          { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
        ]
      );
    } catch (error) {
      console.error('Subscription error:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    }
  };

  // Handle free trial start
  const handleStartTrial = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would call your backend to start a trial
      // For now, we'll simulate a successful trial activation
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get professional plan for trial
      const trialPlan = plans.find(p => p.id === 'professional');
      
      // Update subscription in Redux
      dispatch(updateSubscription({
        plan: trialPlan,
        status: 'trial',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setLoading(false);
      
      Alert.alert(
        'Trial Activated',
        'Your 14-day free trial has been activated! You now have access to all Professional plan features.',
        [
          { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
        ]
      );
    } catch (error) {
      console.error('Trial activation error:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to start trial. Please try again.');
    }
  };

  // Render subscription status section
  const renderSubscriptionStatus = () => {
    if (!subscription.plan) {
      return (
        <Card style={styles.statusCard}>
          <Card.Content>
            <Text style={styles.statusTitle}>No Active Subscription</Text>
            <Text style={styles.statusText}>
              Start a 14-day free trial to access all features of QuickAudit.
            </Text>
            <Button
              mode="contained"
              onPress={handleStartTrial}
              loading={loading}
              disabled={loading}
              style={styles.trialButton}
            >
              Start Free Trial
            </Button>
          </Card.Content>
        </Card>
      );
    }
    
    if (subscription.status === 'trial') {
      const trialEndDate = new Date(subscription.trialEnd);
      const today = new Date();
      const daysLeft = Math.ceil((trialEndDate - today) / (1000 * 60 * 60 * 24));
      
      return (
        <Card style={styles.statusCard}>
          <Card.Content>
            <Text style={styles.statusTitle}>Trial Active</Text>
            <Text style={styles.statusText}>
              You are currently on a free trial of the {subscription.plan.name} plan.
              {daysLeft > 0 ? ` ${daysLeft} days remaining.` : ' Trial ends today.'}
            </Text>
            <Button
              mode="contained"
              onPress={() => setSelectedPlan(subscription.plan)}
              style={styles.subscribeButton}
            >
              Subscribe Now
            </Button>
          </Card.Content>
        </Card>
      );
    }
    
    if (subscription.status === 'active') {
      const endDate = new Date(subscription.endDate);
      const formattedDate = endDate.toLocaleDateString();
      
      return (
        <Card style={styles.statusCard}>
          <Card.Content>
            <Text style={styles.statusTitle}>Active Subscription</Text>
            <Text style={styles.statusText}>
              You are currently subscribed to the {subscription.plan.name} plan.
              Next billing date: {formattedDate}
            </Text>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('BillingHistory')}
              style={styles.billingButton}
            >
              View Billing History
            </Button>
          </Card.Content>
        </Card>
      );
    }
  };

  // Render plan card
  const renderPlanCard = (plan) => {
    const isSelected = selectedPlan && selectedPlan.id === plan.id;
    const isCurrentPlan = subscription.plan && subscription.plan.id === plan.id;
    
    return (
      <TouchableOpacity
        key={plan.id}
        onPress={() => setSelectedPlan(plan)}
        style={[
          styles.planCard,
          isSelected && styles.selectedPlanCard,
          plan.recommended && styles.recommendedPlanCard
        ]}
      >
        {plan.recommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
        )}
        
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planPrice}>${plan.price}<Text style={styles.planInterval}>/{plan.interval}</Text></Text>
        
        <Divider style={styles.divider} />
        
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Icon name="check-circle" size={18} color="#4CAF50" style={styles.featureIcon} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        
        {isCurrentPlan && (
          <View style={styles.currentPlanBadge}>
            <Text style={styles.currentPlanText}>CURRENT PLAN</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Subscription Plans</Text>
      
      {renderSubscriptionStatus()}
      
      <Text style={styles.sectionTitle}>Available Plans</Text>
      
      <View style={styles.plansContainer}>
        {plans.map(plan => renderPlanCard(plan))}
      </View>
      
      {selectedPlan && subscription.plan?.id !== selectedPlan.id && (
        <Button
          mode="contained"
          onPress={handleSubscribe}
          loading={loading}
          disabled={loading}
          style={styles.subscribeButton}
        >
          {subscription.plan ? 'Change Subscription' : 'Subscribe Now'}
        </Button>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All subscriptions automatically renew unless auto-renewal is turned off at least 24 hours before the end of the current period.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
          <Text style={styles.footerLink}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
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
  statusCard: {
    marginBottom: 24,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  trialButton: {
    backgroundColor: '#2563eb',
  },
  subscribeButton: {
    backgroundColor: '#2563eb',
    marginVertical: 24,
  },
  billingButton: {
    borderColor: '#2563eb',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  plansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
  },
  selectedPlanCard: {
    borderColor: '#2563eb',
    borderWidth: 2,
  },
  recommendedPlanCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  recommendedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  currentPlanBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  currentPlanText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
  },
  planInterval: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#6b7280',
  },
  divider: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
  },
  footer: {
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SubscriptionScreen;
