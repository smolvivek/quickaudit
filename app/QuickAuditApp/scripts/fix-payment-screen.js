/**
 * Script to fix TypeScript errors in PaymentScreen.tsx
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

// Fix PaymentScreen.tsx
const fixPaymentScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/features/payment');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Payment Screen
 * Screen for processing payments and managing payment methods
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  Divider,
  RadioButton,
  HelperText,
  ActivityIndicator
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

// Payment method type
interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'razorpay';
  details: {
    last4?: string;
    brand?: string;
    expiryMonth?: string;
    expiryYear?: string;
    email?: string;
  };
  isDefault: boolean;
}

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    details: {
      last4: '4242',
      brand: 'visa',
      expiryMonth: '12',
      expiryYear: '2025'
    },
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'paypal',
    details: {
      email: 'user@example.com'
    },
    isDefault: false
  }
];

const PaymentScreen = ({ route, navigation }) => {
  // Get amount and description from route params or use defaults
  const { amount = 99.99, description = 'Professional Plan Subscription' } = route.params || {};
  
  // State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethods.find(pm => pm.isDefault)?.id || ''
  );
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New card form state
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateCardForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!newCard.number.trim()) {
      newErrors.number = 'Card number is required';
      isValid = false;
    } else if (!/^[0-9]{16}$/.test(newCard.number.replace(/\\s/g, ''))) {
      newErrors.number = 'Invalid card number';
      isValid = false;
    }
    
    if (!newCard.expiry.trim()) {
      newErrors.expiry = 'Expiry date is required';
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\\/[0-9]{2}$/.test(newCard.expiry)) {
      newErrors.expiry = 'Invalid expiry date (MM/YY)';
      isValid = false;
    }
    
    if (!newCard.cvc.trim()) {
      newErrors.cvc = 'CVC is required';
      isValid = false;
    } else if (!/^[0-9]{3,4}$/.test(newCard.cvc)) {
      newErrors.cvc = 'Invalid CVC';
      isValid = false;
    }
    
    if (!newCard.name.trim()) {
      newErrors.name = 'Cardholder name is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleAddCard = () => {
    if (!validateCardForm()) {
      return;
    }
    
    // In a real app, this would call the payment processor API
    const last4 = newCard.number.slice(-4);
    
    const newPaymentMethod: PaymentMethod = {
      id: \`pm_\${Date.now()}\`,
      type: 'card',
      details: {
        last4,
        brand: 'visa', // In a real app, this would be determined by the card number
        expiryMonth: newCard.expiry.split('/')[0],
        expiryYear: \`20\${newCard.expiry.split('/')[1]}\`
      },
      isDefault: false
    };
    
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setSelectedPaymentMethod(newPaymentMethod.id);
    setIsAddingNewCard(false);
    
    // Reset form
    setNewCard({
      number: '',
      expiry: '',
      cvc: '',
      name: ''
    });
  };
  
  const handleSetDefaultPaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setPaymentMethods(updatedMethods);
  };
  
  const handleRemovePaymentMethod = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            const updatedMethods = paymentMethods.filter(method => method.id !== id);
            setPaymentMethods(updatedMethods);
            
            // If the removed method was selected, select the first available method
            if (selectedPaymentMethod === id) {
              setSelectedPaymentMethod(updatedMethods[0]?.id || '');
            }
          }
        }
      ]
    );
  };
  
  const handleProcessPayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    
    // In a real app, this would call the payment processor API
    setTimeout(() => {
      setIsProcessing(false);
      
      Alert.alert(
        'Payment Successful',
        \`Your payment of $\${amount} has been processed successfully.\`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack()
          }
        ]
      );
    }, 2000);
  };
  
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return 'credit-card';
      case 'paypal':
        return 'paypal';
      case 'razorpay':
        return 'cash';
      default:
        return 'credit-card';
    }
  };
  
  const formatCardNumber = (number: string) => {
    const cleaned = number.replace(/\\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };
  
  const handleCardNumberChange = (text: string) => {
    const formattedText = formatCardNumber(text);
    setNewCard({ ...newCard, number: formattedText });
  };
  
  const handleExpiryChange = (text: string) => {
    // Format as MM/YY
    const cleaned = text.replace(/\\D/g, '');
    
    if (cleaned.length <= 2) {
      setNewCard({ ...newCard, expiry: cleaned });
    } else {
      const month = cleaned.substring(0, 2);
      const year = cleaned.substring(2, 4);
      setNewCard({ ...newCard, expiry: \`\${month}/\${year}\` });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Payment</Title>
      </View>
      
      <ScrollView style={styles.content}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Payment Summary</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>$\{amount}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Description</Text>
              <Text style={styles.summaryValue}>{description}</Text>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.paymentMethodsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Payment Method</Title>
            <Divider style={styles.divider} />
            
            <RadioButton.Group
              onValueChange={value => setSelectedPaymentMethod(value)}
              value={selectedPaymentMethod}
            >
              {paymentMethods.map(method => (
                <View key={method.id} style={styles.paymentMethodItem}>
                  <View style={styles.paymentMethodContent}>
                    <RadioButton value={method.id} />
                    <Icon 
                      name={getPaymentMethodIcon(method.type)} 
                      size={24} 
                      color={appTheme.colors.primary}
                      style={styles.paymentMethodIcon}
                    />
                    <View style={styles.paymentMethodDetails}>
                      {method.type === 'card' && (
                        <Text style={styles.paymentMethodTitle}>
                          {method.details.brand?.toUpperCase()} •••• {method.details.last4}
                        </Text>
                      )}
                      {method.type === 'paypal' && (
                        <Text style={styles.paymentMethodTitle}>
                          PayPal - {method.details.email}
                        </Text>
                      )}
                      {method.isDefault && (
                        <Text style={styles.defaultLabel}>Default</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.paymentMethodActions}>
                    {!method.isDefault && (
                      <TouchableOpacity 
                        onPress={() => handleSetDefaultPaymentMethod(method.id)}
                        style={styles.actionButton}
                      >
                        <Text style={styles.actionButtonText}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      onPress={() => handleRemovePaymentMethod(method.id)}
                      style={styles.actionButton}
                    >
                      <Icon name="delete" size={20} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </RadioButton.Group>
            
            {!isAddingNewCard ? (
              <Button 
                mode="outlined" 
                icon="plus" 
                onPress={() => setIsAddingNewCard(true)}
                style={styles.addCardButton}
              >
                Add New Card
              </Button>
            ) : (
              <Card style={styles.newCardForm}>
                <Card.Content>
                  <Title style={styles.newCardTitle}>Add New Card</Title>
                  <Divider style={styles.divider} />
                  
                  <TextInput
                    label="Card Number"
                    value={newCard.number}
                    onChangeText={handleCardNumberChange}
                    keyboardType="numeric"
                    maxLength={19} // 16 digits + 3 spaces
                    style={styles.input}
                    error={!!errors.number}
                    mode="outlined"
                  />
                  {!!errors.number && (
                    <HelperText type="error" visible={!!errors.number}>
                      {errors.number}
                    </HelperText>
                  )}
                  
                  <View style={styles.row}>
                    <View style={styles.halfInput}>
                      <TextInput
                        label="Expiry Date (MM/YY)"
                        value={newCard.expiry}
                        onChangeText={handleExpiryChange}
                        keyboardType="numeric"
                        maxLength={5} // MM/YY
                        style={styles.input}
                        error={!!errors.expiry}
                        mode="outlined"
                      />
                      {!!errors.expiry && (
                        <HelperText type="error" visible={!!errors.expiry}>
                          {errors.expiry}
                        </HelperText>
                      )}
                    </View>
                    
                    <View style={styles.halfInput}>
                      <TextInput
                        label="CVC"
                        value={newCard.cvc}
                        onChangeText={(text) => setNewCard({ ...newCard, cvc: text })}
                        keyboardType="numeric"
                        maxLength={4}
                        style={styles.input}
                        error={!!errors.cvc}
                        mode="outlined"
                      />
                      {!!errors.cvc && (
                        <HelperText type="error" visible={!!errors.cvc}>
                          {errors.cvc}
                        </HelperText>
                      )}
                    </View>
                  </View>
                  
                  <TextInput
                    label="Cardholder Name"
                    value={newCard.name}
                    onChangeText={(text) => setNewCard({ ...newCard, name: text })}
                    style={styles.input}
                    error={!!errors.name}
                    mode="outlined"
                  />
                  {!!errors.name && (
                    <HelperText type="error" visible={!!errors.name}>
                      {errors.name}
                    </HelperText>
                  )}
                  
                  <View style={styles.formActions}>
                    <Button 
                      mode="outlined" 
                      onPress={() => setIsAddingNewCard(false)}
                      style={styles.formButton}
                    >
                      Cancel
                    </Button>
                    <Button 
                      mode="contained" 
                      onPress={handleAddCard}
                      style={styles.formButton}
                    >
                      Add Card
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            )}
          </Card.Content>
        </Card>
        
        <View style={styles.securePaymentInfo}>
          <Icon name="shield-check" size={20} color="#4caf50" style={styles.secureIcon} />
          <Text style={styles.secureText}>
            Your payment information is secure and encrypted
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={handleProcessPayment}
          disabled={!selectedPaymentMethod || isProcessing}
          style={styles.payButton}
          loading={isProcessing}
        >
          {isProcessing ? 'Processing...' : \`Pay $\${amount}\`}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  divider: {
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethodsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    marginHorizontal: 8,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
  },
  defaultLabel: {
    fontSize: 12,
    color: appTheme.colors.primary,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
    padding: 4,
  },
  actionButtonText: {
    color: appTheme.colors.primary,
    fontSize: 12,
  },
  addCardButton: {
    marginTop: 16,
  },
  newCardForm: {
    marginTop: 16,
    backgroundColor: '#f9f9f9',
  },
  newCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  formButton: {
    width: '48%',
  },
  securePaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  secureIcon: {
    marginRight: 8,
  },
  secureText: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  payButton: {
    height: 50,
    justifyContent: 'center',
  },
});

export default PaymentScreen;`;

  fs.writeFileSync(path.join(dirPath, 'PaymentScreen.tsx'), content, 'utf8');
  console.log('Fixed PaymentScreen.tsx');
};

// Run the function
console.log('Fixing PaymentScreen...');
fixPaymentScreen();
console.log('PaymentScreen fixed successfully!');
