import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';

export const ContactUsScreen = () => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', { name, email, message });
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@quickaudit.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+919876543210');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text variant="headlineMedium" style={styles.title}>
          Contact Us
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          We're here to help! Reach out to us through any of the following channels:
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Get in Touch
        </Text>
        <Text variant="bodyLarge" style={styles.contactItem} onPress={handleEmailPress}>
          📧 Email: support@quickaudit.com
        </Text>
        <Text variant="bodyLarge" style={styles.contactItem} onPress={handlePhonePress}>
          📞 Phone: +91 98765 43210
        </Text>
        <Text variant="bodyLarge" style={styles.contactItem}>
          🏢 Address: 123 Tech Park, Bangalore, Karnataka, India - 560103
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Send us a Message
        </Text>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Message"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Send Message
        </Button>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.subtitle}>
          Business Hours
        </Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          Monday - Friday: 9:00 AM - 6:00 PM IST{'\n'}
          Saturday: 10:00 AM - 2:00 PM IST{'\n'}
          Sunday: Closed
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
  contactItem: {
    marginBottom: 8,
    lineHeight: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 