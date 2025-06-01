/**
 * Subscription Details Screen
 * Shows details of the user's current subscription
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Title, Paragraph, Divider } from 'react-native-paper';
import { appTheme } from '../../theme/webAppTheme';

const SubscriptionDetailsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Current Subscription</Title>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Professional Plan</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>$29.99/month</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Period:</Text>
            <Text style={styles.detailValue}>May 1, 2023 - June 1, 2023</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Auto-Renew:</Text>
            <Text style={styles.detailValue}>Yes</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>Visa ending in 4242</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button mode="outlined" style={styles.button}>
              Change Plan
            </Button>
            <Button mode="outlined" style={styles.button}>
              Cancel Auto-Renew
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Billing History</Title>
          
          <View style={styles.billingItem}>
            <View>
              <Text style={styles.billingDate}>May 1, 2023</Text>
              <Text style={styles.billingMethod}>Visa ending in 4242</Text>
            </View>
            <View>
              <Text style={styles.billingAmount}>$29.99</Text>
              <View style={styles.billingStatus}>
                <Text style={styles.billingStatusText}>PAID</Text>
              </View>
            </View>
          </View>
          
          <Divider style={styles.itemDivider} />
          
          <View style={styles.billingItem}>
            <View>
              <Text style={styles.billingDate}>April 1, 2023</Text>
              <Text style={styles.billingMethod}>Visa ending in 4242</Text>
            </View>
            <View>
              <Text style={styles.billingAmount}>$29.99</Text>
              <View style={styles.billingStatus}>
                <Text style={styles.billingStatusText}>PAID</Text>
              </View>
            </View>
          </View>
          
          <Divider style={styles.itemDivider} />
          
          <View style={styles.billingItem}>
            <View>
              <Text style={styles.billingDate}>March 1, 2023</Text>
              <Text style={styles.billingMethod}>Visa ending in 4242</Text>
            </View>
            <View>
              <Text style={styles.billingAmount}>$29.99</Text>
              <View style={styles.billingStatus}>
                <Text style={styles.billingStatusText}>PAID</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  planHeader: {
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
    backgroundColor: '#e6f7e6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4caf50',
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
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  billingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  billingDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  billingMethod: {
    fontSize: 14,
    color: '#666',
  },
  billingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  billingStatus: {
    backgroundColor: '#e6f7e6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  billingStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  itemDivider: {
    marginVertical: 8,
  },
});

export default SubscriptionDetailsScreen;