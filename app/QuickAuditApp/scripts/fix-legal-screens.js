/**
 * Script to fix TypeScript errors in legal screens
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

// Fix TermsScreen.tsx
const fixTermsScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/legal');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Terms and Conditions Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { appTheme } from '../../theme/webAppTheme';

const TermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.lastUpdated}>Last Updated: May 1, 2023</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using QuickAudit, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this app.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.paragraph}>
          Permission is granted to temporarily download one copy of the app for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </Text>
        <Text style={styles.bulletPoint}>• modify or copy the materials;</Text>
        <Text style={styles.bulletPoint}>• use the materials for any commercial purpose;</Text>
        <Text style={styles.bulletPoint}>• attempt to decompile or reverse engineer any software contained in QuickAudit;</Text>
        <Text style={styles.bulletPoint}>• remove any copyright or other proprietary notations from the materials;</Text>
        <Text style={styles.bulletPoint}>• transfer the materials to another person or "mirror" the materials on any other server.</Text>
        
        <Text style={styles.sectionTitle}>3. Disclaimer</Text>
        <Text style={styles.paragraph}>
          The materials on QuickAudit are provided on an 'as is' basis. QuickAudit makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </Text>
        
        <Text style={styles.sectionTitle}>4. Limitations</Text>
        <Text style={styles.paragraph}>
          In no event shall QuickAudit or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on QuickAudit, even if QuickAudit or a QuickAudit authorized representative has been notified orally or in writing of the possibility of such damage.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Accuracy of Materials</Text>
        <Text style={styles.paragraph}>
          The materials appearing on QuickAudit could include technical, typographical, or photographic errors. QuickAudit does not warrant that any of the materials on its app are accurate, complete or current. QuickAudit may make changes to the materials contained on its app at any time without notice.
        </Text>
        
        <Text style={styles.sectionTitle}>6. Links</Text>
        <Text style={styles.paragraph}>
          QuickAudit has not reviewed all of the sites linked to its app and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by QuickAudit of the site. Use of any such linked website is at the user's own risk.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Modifications</Text>
        <Text style={styles.paragraph}>
          QuickAudit may revise these terms of service for its app at any time without notice. By using this app you are agreeing to be bound by the then current version of these terms of service.
        </Text>
        
        <Text style={styles.sectionTitle}>8. Governing Law</Text>
        <Text style={styles.paragraph}>
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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

export default TermsScreen;`;

  fs.writeFileSync(path.join(dirPath, 'TermsScreen.tsx'), content, 'utf8');
  console.log('Fixed TermsScreen.tsx');
};

// Fix PrivacyScreen.tsx
const fixPrivacyScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/legal');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
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

export default PrivacyScreen;`;

  fs.writeFileSync(path.join(dirPath, 'PrivacyScreen.tsx'), content, 'utf8');
  console.log('Fixed PrivacyScreen.tsx');
};

// Run all functions
console.log('Fixing legal screens...');
fixTermsScreen();
fixPrivacyScreen();
console.log('Legal screens fixed successfully!');
