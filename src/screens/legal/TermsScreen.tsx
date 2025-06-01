import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const TermsScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text variant="headlineMedium" style={styles.title}>
          Terms and Conditions
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          1. Agreement to Terms
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          By accessing or using QuickAudit, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          2. Subscription Terms
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          • Subscriptions are billed on a monthly basis{'\n'}
          • You can cancel your subscription at any time{'\n'}
          • Refunds are processed according to our refund policy{'\n'}
          • We reserve the right to modify subscription prices with notice
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          3. User Responsibilities
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          You agree to:{'\n'}
          • Provide accurate information{'\n'}
          • Maintain the security of your account{'\n'}
          • Use the service in compliance with laws{'\n'}
          • Not misuse or abuse the service
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          4. Intellectual Property
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          The service and its original content, features, and functionality are owned by QuickAudit and are protected by international copyright, trademark, and other intellectual property laws.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          5. Limitation of Liability
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          QuickAudit shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          6. Changes to Terms
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date of these terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          7. Governing Law
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          8. Contact Information
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          For any questions about these Terms, please contact us at:{'\n\n'}
          Email: legal@quickaudit.com{'\n'}
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