import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const RefundPolicyScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text variant="headlineMedium" style={styles.title}>
          Refund and Cancellation Policy
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          1. Subscription Cancellation
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          • You can cancel your subscription at any time{'\n'}
          • Cancellation will take effect at the end of your current billing period{'\n'}
          • You will continue to have access to the service until the end of your paid period{'\n'}
          • No refunds are provided for partial months of service
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          2. Refund Eligibility
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          Refunds may be provided in the following circumstances:{'\n\n'}
          • Technical issues preventing service usage{'\n'}
          • Billing errors or duplicate charges{'\n'}
          • Service unavailability for extended periods{'\n'}
          • Within 7 days of initial subscription (first-time users only)
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          3. Refund Process
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          1. Submit a refund request through the app or email{'\n'}
          2. Include your account details and reason for refund{'\n'}
          3. Our team will review your request within 2 business days{'\n'}
          4. If approved, refund will be processed within 5-7 business days{'\n'}
          5. Refund will be issued to the original payment method
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          4. Non-Refundable Items
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          The following are not eligible for refunds:{'\n'}
          • Partial month usage{'\n'}
          • Additional services or add-ons{'\n'}
          • Custom development work{'\n'}
          • Training sessions
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          5. Special Circumstances
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          We may consider refunds in special circumstances such as:{'\n'}
          • Extended service outages{'\n'}
          • Significant feature changes{'\n'}
          • Force majeure events{'\n'}
          • Legal requirements
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          6. Contact Information
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          For refund requests or questions about this policy, contact us at:{'\n\n'}
          Email: support@quickaudit.com{'\n'}
          Phone: +91 98765 43210{'\n'}
          Address: 123 Tech Park, Bangalore, Karnataka, India - 560103
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 12,
  },
  paragraph: {
    lineHeight: 24,
  },
}); 