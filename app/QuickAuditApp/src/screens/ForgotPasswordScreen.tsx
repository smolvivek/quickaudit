/**
 * ForgotPasswordScreen Component
 * Handles password reset requests
 */

import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { appTheme } from '../theme';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation();
  const { forgotPassword } = useAuth();
  
  // Validate email
  const validateEmail = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  // Handle forgot password
  const handleForgotPassword = async () => {
    const isEmailValid = validateEmail();
    
    if (isEmailValid) {
      setIsLoading(true);
      
      try {
        const success = await forgotPassword(email);
        
        if (success) {
          Alert.alert(
            'Password Reset Email Sent',
            'Please check your email for instructions to reset your password.',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
        } else {
          Alert.alert('Error', 'Failed to send password reset email. Please try again.');
        }
      } catch (error) {
        console.error('Forgot password error:', error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo-placeholder.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>QuickAudit</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.description}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={validateEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
            error={!!emailError}
          />
          {!!emailError && <HelperText type="error">{emailError}</HelperText>}
          
          <Button
            mode="contained"
            onPress={handleForgotPassword}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            Reset Password
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.textButton}
          >
            Back to Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: appTheme.colors.text,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: appTheme.colors.text,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  textButton: {
    marginTop: 12,
  },
});

export default ForgotPasswordScreen;