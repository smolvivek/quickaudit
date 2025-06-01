import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, List, Button, TextInput } from 'react-native-paper';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { PaymentMethod } from '../services/api';

interface PaymentMethodScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({ navigation }) => {
  const { paymentMethods, loading, error, addPaymentMethod, deletePaymentMethod } = usePaymentMethods();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPaymentMethod = async () => {
    if (!cardNumber || !expiryDate || !cvv || !name) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsAdding(true);
      await addPaymentMethod({
        cardNumber,
        expiryDate,
        cvv,
        name,
      });
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setName('');
    } catch (error) {
      alert('Failed to add payment method');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (method: PaymentMethod) => {
    try {
      await deletePaymentMethod(method.id);
    } catch (error) {
      alert('Failed to delete payment method');
    }
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <Card key={method.id} style={styles.paymentMethodCard}>
      <Card.Content>
        <List.Item
          title={method.name}
          description={`•••• ${method.cardNumber.slice(-4)}`}
          right={() => (
            <TouchableOpacity onPress={() => handleDelete(method)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          )}
        />
      </Card.Content>
    </Card>
  );

  if (loading && !paymentMethods.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Payment Methods</Text>

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        <Card style={styles.addCardContainer}>
          <Card.Content>
            <TextInput
              label="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Expiry Date (MM/YY)"
              value={expiryDate}
              onChangeText={setExpiryDate}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Name on Card"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleAddPaymentMethod}
              loading={isAdding}
              disabled={isAdding}
            >
              Add Payment Method
            </Button>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
        {paymentMethods.map((method) => renderPaymentMethod(method))}
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
  error: {
    color: 'red',
    marginBottom: 16,
  },
  addCardContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  paymentMethodCard: {
    marginBottom: 16,
  },
  deleteButton: {
    color: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentMethodScreen;
