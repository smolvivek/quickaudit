import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { CardField, useStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentMethod } from '../redux/slices/subscriptionSlice';

const PaymentMethodScreen = ({ navigation, route }) => {
  const { confirmPayment, loading: confirmLoading } = useConfirmPayment();
  const { createPaymentMethod, loading: createLoading } = useStripe();
  const dispatch = useDispatch();
  const subscription = useSelector(state => state.subscription);
  const user = useSelector(state => state.auth.user);
  
  const [cardDetails, setCardDetails] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle adding payment method
  const handleAddPaymentMethod = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter the cardholder name');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would call your backend to create a setup intent
      // For now, we'll simulate a successful payment method creation

      // Create a payment method with Stripe
      const { paymentMethod, error: stripeError } = await createPaymentMethod({
        type: 'Card',
        billingDetails: {
          name,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // In a real implementation, you would attach this payment method to the customer
      // on your backend

      // Add payment method to Redux store
      dispatch(addPaymentMethod({
        id: paymentMethod.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expiryMonth: paymentMethod.card.expiryMonth,
        expiryYear: paymentMethod.card.expiryYear,
        name,
      }));

      setLoading(false);

      // Navigate back or to subscription screen
      if (route.params?.returnTo) {
        navigation.navigate(route.params.returnTo);
      } else {
        navigation.goBack();
      }

      Alert.alert('Success', 'Payment method added successfully');
    } catch (error) {
      console.error('Payment method error:', error);
      setError(error.message);
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to add payment method');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name on card"
          mode="outlined"
        />

        <Text style={styles.label}>Card Information</Text>
        <CardField
          postalCodeEnabled={true}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.cardStyle}
          style={styles.cardField}
          onCardChange={cardDetails => {
            setCardDetails(cardDetails);
          }}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleAddPaymentMethod}
          loading={loading || confirmLoading || createLoading}
          disabled={loading || confirmLoading || createLoading || !cardDetails?.complete}
          style={styles.button}
        >
          Add Payment Method
        </Button>
      </View>

      <View style={styles.securityInfo}>
        <Text style={styles.securityText}>
          Your payment information is securely processed by Stripe. QuickAudit does not store your full card details.
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
    marginBottom: 24,
    color: '#1f2937',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 24,
  },
  cardStyle: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  button: {
    backgroundColor: '#2563eb',
    marginTop: 8,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
  },
  securityInfo: {
    marginBottom: 32,
  },
  securityText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default PaymentMethodScreen;
