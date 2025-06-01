/**
 * Refund Policy Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { appTheme } from '../../theme/webAppTheme';

const RefundPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Refund Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: May 1, 2023</Text>
        
        <Text style={styles.paragraph}>
          Thank you for choosing QuickAudit. We value your satisfaction and are committed to providing you with the best service possible. This Refund Policy outlines our guidelines for refunds and cancellations.
        </Text>
        
        <Text style={styles.sectionTitle}>1. Subscription Refunds</Text>
        <Text style={styles.paragraph}>
          For monthly subscriptions, we offer a 7-day money-back guarantee from the date of purchase. If you are not satisfied with our service within this period, you may request a full refund by contacting our support team at support@quickaudit.com.
        </Text>
        <Text style={styles.paragraph}>
          For annual subscriptions, we offer a 14-day money-back guarantee from the date of purchase. The same conditions apply as for monthly subscriptions.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Refund Process</Text>
        <Text style={styles.paragraph}>
          To request a refund, please contact our support team at support@quickaudit.com with your account details and reason for the refund. Once your request is received, we will review it and process it within 5-7 business days.
        </Text>
        <Text style={styles.paragraph}>
          Refunds will be issued to the original payment method used for the purchase.
        </Text>
        
        <Text style={styles.sectionTitle}>3. Cancellation Policy</Text>
        <Text style={styles.paragraph}>
          You may cancel your subscription at any time through your account settings or by contacting our support team. Once cancelled, your subscription will remain active until the end of the current billing period, after which it will not renew.
        </Text>
        <Text style={styles.paragraph}>
          No partial refunds will be provided for unused portions of your subscription period after the refund eligibility period has passed.
        </Text>
        
        <Text style={styles.sectionTitle}>4. Exceptions</Text>
        <Text style={styles.paragraph}>
          We reserve the right to deny refund requests in cases where:
        </Text>
        <Text style={styles.bulletPoint}>• The refund is requested after the eligibility period</Text>
        <Text style={styles.bulletPoint}>• There is evidence of fraud or abuse</Text>
        <Text style={styles.bulletPoint}>• The service has been extensively used during the refund period</Text>
        
        <Text style={styles.sectionTitle}>5. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about our Refund Policy, please contact us at:
        </Text>
        <Text style={styles.contactInfo}>Email: support@quickaudit.com</Text>
        <Text style={styles.contactInfo}>Phone: (555) 123-4567</Text>
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
    color: appTheme.colors.primary,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
    color: '#333',
  },
  contactInfo: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
});

export default RefundPolicyScreen;