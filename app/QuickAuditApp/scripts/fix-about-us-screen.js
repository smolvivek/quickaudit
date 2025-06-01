/**
 * Script to fix TypeScript errors in AboutUsScreen
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

// Fix AboutUsScreen.tsx
const fixAboutUsScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/legal');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * About Us Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { appTheme } from '../../theme/webAppTheme';

const AboutUsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About QuickAudit</Text>
        
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={styles.paragraph}>
          QuickAudit is a leading mobile application designed to streamline and simplify the audit process for businesses of all sizes. Our mission is to provide a user-friendly, efficient, and comprehensive audit solution that helps organizations maintain compliance, improve quality, and reduce risk.
        </Text>
        
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          Founded in 2020, QuickAudit was born out of the frustration experienced by our founders with traditional audit processes. They recognized the need for a modern, digital solution that could replace paper-based audits and complex spreadsheets. After extensive research and development, QuickAudit was launched to transform how businesses conduct audits.
        </Text>
        
        <Text style={styles.sectionTitle}>Our Vision</Text>
        <Text style={styles.paragraph}>
          We envision a world where audits are no longer viewed as a necessary burden but as a valuable opportunity for continuous improvement. By leveraging technology, we aim to make audits more accessible, actionable, and insightful for organizations worldwide.
        </Text>
        
        <Text style={styles.sectionTitle}>Our Values</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.valueName}>Innovation</Text>
          <Text style={styles.valueDescription}>
            We continuously seek new ways to improve our platform and stay ahead of industry needs.
          </Text>
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={styles.valueName}>Reliability</Text>
          <Text style={styles.valueDescription}>
            We build robust solutions that our customers can depend on for their critical audit processes.
          </Text>
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={styles.valueName}>Simplicity</Text>
          <Text style={styles.valueDescription}>
            We believe in making complex processes simple and intuitive for all users.
          </Text>
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={styles.valueName}>Security</Text>
          <Text style={styles.valueDescription}>
            We prioritize the protection of our customers' data with industry-leading security measures.
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>Our Team</Text>
        <Text style={styles.paragraph}>
          QuickAudit is powered by a diverse team of professionals with expertise in software development, quality assurance, compliance, and customer success. Our team is dedicated to delivering exceptional value and support to our customers.
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
    marginBottom: 16,
    textAlign: 'center',
  },
  logo: {
    width: '100%',
    height: 120,
    marginBottom: 24,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: appTheme.colors.secondary,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
  },
  valueContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  valueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: appTheme.colors.primary,
  },
  valueDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },
});

export default AboutUsScreen;`;

  fs.writeFileSync(path.join(dirPath, 'AboutUsScreen.tsx'), content, 'utf8');
  console.log('Fixed AboutUsScreen.tsx');
};

// Run the function
console.log('Fixing AboutUsScreen...');
fixAboutUsScreen();
console.log('AboutUsScreen fixed successfully!');
