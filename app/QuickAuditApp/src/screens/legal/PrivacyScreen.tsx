/**
 * Privacy Policy Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { appTheme } from '../../theme/webAppTheme';

const PrivacyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: May 1, 2023</Text>
        
        <Text style={styles.paragraph}>
          QuickAudit ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by QuickAudit.
        </Text>
        
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us when you:
        </Text>
        <Text style={styles.bulletPoint}>• Create or modify your account</Text>
        <Text style={styles.bulletPoint}>• Conduct audits using our application</Text>
        <Text style={styles.bulletPoint}>• Contact customer support</Text>
        <Text style={styles.bulletPoint}>• Complete forms within the application</Text>
        
        <Text style={styles.paragraph}>
          The types of information we may collect include:
        </Text>
        <Text style={styles.bulletPoint}>• Name, email address, and phone number</Text>
        <Text style={styles.bulletPoint}>• Company information</Text>
        <Text style={styles.bulletPoint}>• Audit data including photos, notes, and responses</Text>
        <Text style={styles.bulletPoint}>• Payment information</Text>
        
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:
        </Text>
        <Text style={styles.bulletPoint}>• Provide, maintain, and improve our services</Text>
        <Text style={styles.bulletPoint}>• Process transactions and send related information</Text>
        <Text style={styles.bulletPoint}>• Send technical notices, updates, and support messages</Text>
        <Text style={styles.bulletPoint}>• Respond to your comments and questions</Text>
        <Text style={styles.bulletPoint}>• Develop new products and services</Text>
        
        <Text style={styles.sectionTitle}>Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We may share your information as follows:
        </Text>
        <Text style={styles.bulletPoint}>• With vendors and service providers who need access to such information to carry out work on our behalf</Text>
        <Text style={styles.bulletPoint}>• In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</Text>
        <Text style={styles.bulletPoint}>• If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of QuickAudit or others</Text>
        
        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.paragraph}>
          We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.
        </Text>
        
        <Text style={styles.sectionTitle}>Your Choices</Text>
        <Text style={styles.paragraph}>
          Account Information: You may update, correct, or delete your account information at any time by logging into your account or contacting us.
        </Text>
        
        <Text style={styles.sectionTitle}>Changes to this Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
        </Text>
        
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at: privacy@quickaudit.com
        </Text>
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
});

export default PrivacyScreen;