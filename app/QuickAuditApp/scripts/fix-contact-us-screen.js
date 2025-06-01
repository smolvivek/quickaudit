/**
 * Script to fix TypeScript errors in ContactUsScreen
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

// Fix ContactUsScreen.tsx
const fixContactUsScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/legal');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Contact Us Screen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { appTheme } from '../../theme/webAppTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactUsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!name || !email || !message || !subject) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Submit form logic would go here
    Alert.alert('Success', 'Your message has been sent. We will get back to you soon!');
    
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    setSubject('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Contact Us</Title>
        <Paragraph style={styles.subtitle}>
          We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.
        </Paragraph>
        
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            
            <TextInput
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              style={styles.input}
            />
            
            <TextInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              style={[styles.input, styles.messageInput]}
            />
            
            <Button 
              mode="contained" 
              onPress={handleSubmit}
              style={styles.button}
            >
              Send Message
            </Button>
          </Card.Content>
        </Card>
        
        <Title style={styles.contactTitle}>Other Ways to Reach Us</Title>
        
        <View style={styles.contactRow}>
          <Icon name="email" size={24} color={appTheme.colors.primary} style={styles.contactIcon} />
          <View>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactInfo}>support@quickaudit.com</Text>
          </View>
        </View>
        
        <View style={styles.contactRow}>
          <Icon name="phone" size={24} color={appTheme.colors.primary} style={styles.contactIcon} />
          <View>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactInfo}>(555) 123-4567</Text>
          </View>
        </View>
        
        <View style={styles.contactRow}>
          <Icon name="map-marker" size={24} color={appTheme.colors.primary} style={styles.contactIcon} />
          <View>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactInfo}>123 Audit Lane</Text>
            <Text style={styles.contactInfo}>Suite 456</Text>
            <Text style={styles.contactInfo}>San Francisco, CA 94103</Text>
          </View>
        </View>
        
        <View style={styles.contactRow}>
          <Icon name="clock" size={24} color={appTheme.colors.primary} style={styles.contactIcon} />
          <View>
            <Text style={styles.contactLabel}>Business Hours</Text>
            <Text style={styles.contactInfo}>Monday - Friday: 9am - 5pm PST</Text>
            <Text style={styles.contactInfo}>Saturday - Sunday: Closed</Text>
          </View>
        </View>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  card: {
    marginBottom: 24,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  messageInput: {
    height: 120,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  contactIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});

export default ContactUsScreen;`;

  fs.writeFileSync(path.join(dirPath, 'ContactUsScreen.tsx'), content, 'utf8');
  console.log('Fixed ContactUsScreen.tsx');
};

// Run the function
console.log('Fixing ContactUsScreen...');
fixContactUsScreen();
console.log('ContactUsScreen fixed successfully!');
