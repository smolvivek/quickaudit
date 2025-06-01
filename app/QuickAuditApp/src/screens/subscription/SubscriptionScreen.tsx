/**
 * Subscription Screen
 * Allows users to select and manage their subscription plan
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import { appTheme } from '../../theme/webAppTheme';

const SubscriptionScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Subscription Plans</Title>
        <Paragraph style={styles.subtitle}>
          Choose the plan that works best for you
        </Paragraph>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Basic Plan</Title>
          <Paragraph>$9.99/month</Paragraph>
          <View style={styles.features}>
            <Text style={styles.feature}>• Up to 10 audits per month</Text>
            <Text style={styles.feature}>• Basic reporting</Text>
            <Text style={styles.feature}>• Email support</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" style={styles.button}>
            Select Plan
          </Button>
        </Card.Actions>
      </Card>
      
      <Card style={[styles.card, styles.featuredCard]}>
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>POPULAR</Text>
        </View>
        <Card.Content>
          <Title>Professional Plan</Title>
          <Paragraph>$29.99/month</Paragraph>
          <View style={styles.features}>
            <Text style={styles.feature}>• Unlimited audits</Text>
            <Text style={styles.feature}>• Advanced reporting</Text>
            <Text style={styles.feature}>• Priority support</Text>
            <Text style={styles.feature}>• Data analytics</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" style={styles.button}>
            Select Plan
          </Button>
        </Card.Actions>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Enterprise Plan</Title>
          <Paragraph>$99.99/month</Paragraph>
          <View style={styles.features}>
            <Text style={styles.feature}>• Unlimited audits</Text>
            <Text style={styles.feature}>• Custom reporting</Text>
            <Text style={styles.feature}>• Dedicated support</Text>
            <Text style={styles.feature}>• White labeling</Text>
            <Text style={styles.feature}>• API access</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" style={styles.button}>
            Select Plan
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: appTheme.colors.primary,
  },
  featuredBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: appTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  featuredText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  features: {
    marginTop: 16,
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    width: '100%',
  },
});

export default SubscriptionScreen;