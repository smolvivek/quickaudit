import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const PrivacyPolicyScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text variant="headlineMedium" style={styles.title}>
          Privacy Policy
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Introduction
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          QuickAudit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Information We Collect
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          1. Personal Information:{'\n'}
          • Name and contact information{'\n'}
          • Email address{'\n'}
          • Company information{'\n'}
          • Payment details{'\n\n'}
          2. Usage Information:{'\n'}
          • Audit data and reports{'\n'}
          • Device information{'\n'}
          • Location data (with permission){'\n'}
          • Usage patterns and preferences
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          How We Use Your Information
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          • To provide and maintain our services{'\n'}
          • To process your payments{'\n'}
          • To send you important updates{'\n'}
          • To improve our services{'\n'}
          • To comply with legal obligations
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Data Security
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Data Retention
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Your Rights
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          You have the right to:{'\n'}
          • Access your personal data{'\n'}
          • Correct inaccurate data{'\n'}
          • Request deletion of your data{'\n'}
          • Object to data processing{'\n'}
          • Data portability
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Contact Us
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at:{'\n\n'}
          Email: privacy@quickaudit.com{'\n'}
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