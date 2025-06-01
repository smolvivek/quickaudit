/**
 * Script to fix TypeScript errors in PrivacyPolicyScreen
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Fix PrivacyPolicyScreen.tsx
const fixPrivacyPolicyScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/legal');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Privacy Policy Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { appTheme } from '../../theme/webAppTheme';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: May 1, 2023</Text>
        
        <Text style={styles.paragraph}>
          At QuickAudit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
        </Text>
        
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          We may collect information about you in various ways, including:
        </Text>
        <Text style={styles.bulletPoint}>• Personal Data: Name, email address, phone number, company information</Text>
        <Text style={styles.bulletPoint}>• Usage Data: How you interact with our app, features you use, and time spent</Text>
        <Text style={styles.bulletPoint}>• Device Information: Device type, operating system, unique device identifiers</Text>
        <Text style={styles.bulletPoint}>• Location Data: Geographic location (with your consent)</Text>
        
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect for various purposes, including:
        </Text>
        <Text style={styles.bulletPoint}>• To provide and maintain our service</Text>
        <Text style={styles.bulletPoint}>• To notify you about changes to our service</Text>
        <Text style={styles.bulletPoint}>• To allow you to participate in interactive features</Text>
        <Text style={styles.bulletPoint}>• To provide customer support</Text>
        <Text style={styles.bulletPoint}>• To gather analysis to improve our service</Text>
        <Text style={styles.bulletPoint}>• To monitor the usage of our service</Text>
        <Text style={styles.bulletPoint}>• To detect, prevent and address technical issues</Text>
        
        <Text style={styles.sectionTitle}>Disclosure of Your Information</Text>
        <Text style={styles.paragraph}>
          We may share your information with:
        </Text>
        <Text style={styles.bulletPoint}>• Service Providers: Companies that assist us in providing our services</Text>
        <Text style={styles.bulletPoint}>• Business Partners: With your consent, we may share data with business partners</Text>
        <Text style={styles.bulletPoint}>• Legal Requirements: When required by law or to protect our rights</Text>
        
        <Text style={styles.sectionTitle}>Security of Your Data</Text>
        <Text style={styles.paragraph}>
          The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
        </Text>
        
        <Text style={styles.sectionTitle}>Your Data Protection Rights</Text>
        <Text style={styles.paragraph}>
          You have certain data protection rights, including:
        </Text>
        <Text style={styles.bulletPoint}>• The right to access, update or delete your information</Text>
        <Text style={styles.bulletPoint}>• The right of rectification</Text>
        <Text style={styles.bulletPoint}>• The right to object to processing</Text>
        <Text style={styles.bulletPoint}>• The right of restriction</Text>
        <Text style={styles.bulletPoint}>• The right to data portability</Text>
        <Text style={styles.bulletPoint}>• The right to withdraw consent</Text>
        
        <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </Text>
        
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us:
        </Text>
        <Text style={styles.contactInfo}>By email: privacy@quickaudit.com</Text>
        <Text style={styles.contactInfo}>By phone: (555) 123-4567</Text>
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

export default PrivacyPolicyScreen;`;

  fs.writeFileSync(path.join(dirPath, 'PrivacyPolicyScreen.tsx'), content, 'utf8');
  console.log('Fixed PrivacyPolicyScreen.tsx');
};

// Run the function
console.log('Fixing PrivacyPolicyScreen...');
fixPrivacyPolicyScreen();
console.log('PrivacyPolicyScreen fixed successfully!');
