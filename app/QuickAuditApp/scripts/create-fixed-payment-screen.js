/**
 * Script to create PaymentScreen
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Create PaymentScreen
const createPaymentScreen = () => {
  const screensDir = path.join(process.cwd(), 'src/screens');
  ensureDirectoryExists(screensDir);
  
  const content = `/**
 * PaymentScreen Component
 * Handles subscription payments and billing information
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Chip, RadioButton, ActivityIndicator, HelperText } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

// Mock subscription plans
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    features: [
      'Up to 5 audits per month',
      'Basic reporting',
      'Email support',
      '1 user account'
    ],
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29.99,
    features: [
      'Unlimited audits',
      'Advanced reporting',
      'Priority email support',
      'Up to 5 user accounts',
      'Custom templates'
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    features: [
      'Unlimited audits',
      'Advanced reporting & analytics',
      'Priority phone & email support',
      'Unlimited user accounts',
      'Custom templates',
      'API access',
      'White labeling'
    ],
    recommended: false,
  },
];

interface PaymentFormData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentFormErrors {
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;
  billingAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

const PaymentScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  const selectedPlanDetails = subscriptionPlans.find(plan => plan.id === selectedPlan);
  
  // Update form data
  const updateFormData = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: PaymentFormErrors = {};
    let isValid = true;
    
    // Credit card validation
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
        isValid = false;
      } else if (!/^\\d{16}$/.test(formData.cardNumber.replace(/\\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
        isValid = false;
      }
      
      if (!formData.cardholderName) {
        newErrors.cardholderName = 'Cardholder name is required';
        isValid = false;
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
        isValid = false;
      } else if (!/^(0[1-9]|1[0-2])\\/\\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Invalid format (MM/YY)';
        isValid = false;
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
        isValid = false;
      } else if (!/^\\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
        isValid = false;
      }
    }
    
    // Billing information validation
    if (!formData.billingAddress) {
      newErrors.billingAddress = 'Billing address is required';
      isValid = false;
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
      isValid = false;
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
      isValid = false;
    }
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
      isValid = false;
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Format credit card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Handle payment submission
  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would call a payment API
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Payment Successful',
        \`You have successfully subscribed to the \${selectedPlanDetails?.name} plan.\`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard')
          }
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Render subscription plan card
  const renderPlanCard = (plan) => (
    <Card
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.selectedPlanCard,
      ]}
      onPress={() => setSelectedPlan(plan.id)}
    >
      <Card.Content>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          {plan.recommended && (
            <Chip style={styles.recommendedChip}>Recommended</Chip>
          )}
        </View>
        
        <Text style={styles.planPrice}>
          ${plan.price.toFixed(2)}<Text style={styles.perMonth}>/month</Text>
        </Text>
        
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="check-circle" size={16} color={appTheme.colors.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select the plan that best fits your needs
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          {subscriptionPlans.map(renderPlanCard)}
        </View>
        
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <RadioButton.Group
            onValueChange={value => setPaymentMethod(value)}
            value={paymentMethod}
          >
            <View style={styles.paymentOption}>
              <RadioButton value="creditCard" />
              <Text style={styles.paymentOptionText}>Credit Card</Text>
              <View style={styles.cardIcons}>
                <Icon name="credit-card" size={24} color={appTheme.colors.primary} style={styles.cardIcon} />
                <Icon name="credit-card-outline" size={24} color={appTheme.colors.primary} style={styles.cardIcon} />
              </View>
            </View>
            
            <View style={styles.paymentOption}>
              <RadioButton value="paypal" />
              <Text style={styles.paymentOptionText}>PayPal</Text>
              <Icon name="paypal" size={24} color="#003087" style={styles.cardIcon} />
            </View>
          </RadioButton.Group>
        </View>
        
        {paymentMethod === 'creditCard' && (
          <View style={styles.cardDetailsSection}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <TextInput
              label="Card Number"
              value={formData.cardNumber}
              onChangeText={(text) => updateFormData('cardNumber', formatCardNumber(text))}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={19} // 16 digits + 3 spaces
              mode="outlined"
              error={!!errors.cardNumber}
            />
            {errors.cardNumber && <HelperText type="error">{errors.cardNumber}</HelperText>}
            
            <TextInput
              label="Cardholder Name"
              value={formData.cardholderName}
              onChangeText={(text) => updateFormData('cardholderName', text)}
              style={styles.input}
              mode="outlined"
              error={!!errors.cardholderName}
            />
            {errors.cardholderName && <HelperText type="error">{errors.cardholderName}</HelperText>}
            
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  label="Expiry Date (MM/YY)"
                  value={formData.expiryDate}
                  onChangeText={(text) => updateFormData('expiryDate', text)}
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={5}
                  mode="outlined"
                  error={!!errors.expiryDate}
                />
                {errors.expiryDate && <HelperText type="error">{errors.expiryDate}</HelperText>}
              </View>
              
              <View style={styles.column}>
                <TextInput
                  label="CVV"
                  value={formData.cvv}
                  onChangeText={(text) => updateFormData('cvv', text)}
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={4}
                  mode="outlined"
                  error={!!errors.cvv}
                />
                {errors.cvv && <HelperText type="error">{errors.cvv}</HelperText>}
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.billingSection}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          
          <TextInput
            label="Billing Address"
            value={formData.billingAddress}
            onChangeText={(text) => updateFormData('billingAddress', text)}
            style={styles.input}
            mode="outlined"
            error={!!errors.billingAddress}
          />
          {errors.billingAddress && <HelperText type="error">{errors.billingAddress}</HelperText>}
          
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="City"
                value={formData.city}
                onChangeText={(text) => updateFormData('city', text)}
                style={styles.input}
                mode="outlined"
                error={!!errors.city}
              />
              {errors.city && <HelperText type="error">{errors.city}</HelperText>}
            </View>
            
            <View style={styles.column}>
              <TextInput
                label="State/Province"
                value={formData.state}
                onChangeText={(text) => updateFormData('state', text)}
                style={styles.input}
                mode="outlined"
                error={!!errors.state}
              />
              {errors.state && <HelperText type="error">{errors.state}</HelperText>}
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.column}>
              <TextInput
                label="ZIP/Postal Code"
                value={formData.zipCode}
                onChangeText={(text) => updateFormData('zipCode', text)}
                style={styles.input}
                keyboardType="number-pad"
                mode="outlined"
                error={!!errors.zipCode}
              />
              {errors.zipCode && <HelperText type="error">{errors.zipCode}</HelperText>}
            </View>
            
            <View style={styles.column}>
              <TextInput
                label="Country"
                value={formData.country}
                onChangeText={(text) => updateFormData('country', text)}
                style={styles.input}
                mode="outlined"
                error={!!errors.country}
              />
              {errors.country && <HelperText type="error">{errors.country}</HelperText>}
            </View>
          </View>
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{selectedPlanDetails?.name} Plan</Text>
            <Text style={styles.summaryValue}>${selectedPlanDetails?.price.toFixed(2)}/month</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${selectedPlanDetails?.price.toFixed(2)}/month</Text>
          </View>
        </View>
        
        <Button
          mode="contained"
          onPress={handlePayment}
          style={styles.payButton}
          loading={isProcessing}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Complete Payment'}
        </Button>
        
        <Text style={styles.secureText}>
          <Icon name="lock" size={16} color={appTheme.colors.textSecondary} />
          {' '}Secure payment processed by our payment provider
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: appTheme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: appTheme.colors.textSecondary,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    marginBottom: 16,
  },
  selectedPlanCard: {
    borderColor: appTheme.colors.primary,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.text,
  },
  recommendedChip: {
    backgroundColor: appTheme.colors.primary,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: appTheme.colors.text,
  },
  perMonth: {
    fontSize: 14,
    fontWeight: 'normal',
    color: appTheme.colors.textSecondary,
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
    marginLeft: 8,
    fontSize: 14,
    color: appTheme.colors.text,
  },
  paymentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: appTheme.colors.text,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentOptionText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
    color: appTheme.colors.text,
  },
  cardIcons: {
    flexDirection: 'row',
  },
  cardIcon: {
    marginLeft: 8,
  },
  cardDetailsSection: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  billingSection: {
    marginBottom: 24,
  },
  summarySection: {
    marginBottom: 24,
    backgroundColor: appTheme.colors.surface,
    padding: 16,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: appTheme.colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: appTheme.colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: appTheme.colors.border,
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  payButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  secureText: {
    textAlign: 'center',
    fontSize: 14,
    color: appTheme.colors.textSecondary,
  },
});

export default PaymentScreen;`;

  fs.writeFileSync(path.join(screensDir, 'PaymentScreen.tsx'), content, 'utf8');
  console.log('Created PaymentScreen.tsx');
};

// Run the function
console.log('Creating PaymentScreen...');
createPaymentScreen();
console.log('PaymentScreen created successfully!');
