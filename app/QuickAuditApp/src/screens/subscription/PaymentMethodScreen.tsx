/**
 * Subscription Payment Method Screen
 * Allows users to manage their payment methods for subscriptions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, TextInput, RadioButton, Title } from 'react-native-paper';
import { appTheme } from '../../theme/webAppTheme';

const PaymentMethodScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handleSavePaymentMethod = () => {
    // Basic validation
    if (paymentMethod === 'credit' && (!cardNumber || !expiryDate || !cvv || !name)) {
      Alert.alert('Error', 'Please fill in all credit card details');
      return;
    }
    
    // Save payment method logic would go here
    Alert.alert('Success', 'Payment method saved successfully');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Subscription Payment Methods</Title>
        
        <Card style={styles.card}>
          <Card.Content>
            <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
              <View style={styles.radioItem}>
                <RadioButton value="credit" color={appTheme.colors.primary} />
                <Text style={styles.radioLabel}>Credit / Debit Card</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="paypal" color={appTheme.colors.primary} />
                <Text style={styles.radioLabel}>PayPal</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="razorpay" color={appTheme.colors.primary} />
                <Text style={styles.radioLabel}>Razorpay</Text>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>
        
        {paymentMethod === 'credit' && (
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={16}
              />
              
              <View style={styles.row}>
                <TextInput
                  label="Expiry Date (MM/YY)"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  style={[styles.input, styles.halfInput]}
                  keyboardType="number-pad"
                  maxLength={5}
                />
                
                <TextInput
                  label="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  style={[styles.input, styles.halfInput]}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
              
              <TextInput
                label="Name on Card"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </Card.Content>
          </Card>
        )}
        
        {paymentMethod === 'paypal' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.infoText}>
                You will be redirected to PayPal to complete your subscription payment.
              </Text>
            </Card.Content>
          </Card>
        )}
        
        {paymentMethod === 'razorpay' && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.infoText}>
                You will be redirected to Razorpay to complete your subscription payment.
              </Text>
            </Card.Content>
          </Card>
        )}
        
        <Button
          mode="contained"
          onPress={handleSavePaymentMethod}
          style={styles.button}
        >
          Save Payment Method
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default PaymentMethodScreen;