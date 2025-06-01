/**
 * Script to fix TypeScript errors in ForgotPasswordScreen
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

// Fix ForgotPasswordScreen.tsx
const fixForgotPasswordScreen = () => {
  const dirPath = path.join(process.cwd(), 'src/screens/auth');
  ensureDirectoryExists(dirPath);
  
  const content = `/**
 * Forgot Password Screen
 * Screen for users to request a password reset
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Title,
  HelperText
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Form validation
  const [emailError, setEmailError] = useState('');
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };
  
  const handleSendResetLink = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to send a password reset email
      // For now, we'll simulate a successful email send
      setTimeout(() => {
        setLoading(false);
        setEmailSent(true);
      }, 2000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to send reset link. Please try again.');
    }
  };
  
  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
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
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Title style={styles.appTitle}>QuickAudit</Title>
          <Text style={styles.tagline}>Reset Your Password</Text>
        </View>
        
        {!emailSent ? (
          <View style={styles.formContainer}>
            <Text style={styles.instructionText}>
              Enter your email address below and we'll send you a link to reset your password.
            </Text>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={!!emailError}
              mode="outlined"
              outlineColor={appTheme.colors.outline}
              activeOutlineColor={appTheme.colors.primary}
            />
            {!!emailError && (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            )}
            
            <Button
              mode="contained"
              onPress={handleSendResetLink}
              style={styles.resetButton}
              loading={loading}
              disabled={loading}
            >
              Send Reset Link
            </Button>
            
            <TouchableOpacity onPress={navigateToLogin} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Icon name="email-check-outline" size={64} color={appTheme.colors.primary} style={styles.successIcon} />
            <Title style={styles.successTitle}>Check Your Email</Title>
            <Text style={styles.successText}>
              We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
            </Text>
            <Text style={styles.noteText}>
              If you don't see the email in your inbox, please check your spam folder.
            </Text>
            
            <Button
              mode="contained"
              onPress={() => navigation.navigate('ResetPassword', { email })}
              style={styles.continueButton}
            >
              Continue to Reset Password
            </Button>
            
            <View style={styles.actionLinks}>
              <TouchableOpacity onPress={handleTryAgain}>
                <Text style={styles.actionLinkText}>Try with a different email</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.actionLinkText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
    marginTop: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: appTheme.colors.primary,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
  successContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appTheme.colors.primary,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  continueButton: {
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: appTheme.colors.primary,
    width: '100%',
  },
  actionLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionLinkText: {
    fontSize: 14,
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;`;

  fs.writeFileSync(path.join(dirPath, 'ForgotPasswordScreen.tsx'), content, 'utf8');
  console.log('Fixed ForgotPasswordScreen.tsx');
};

// Run the function
console.log('Fixing ForgotPasswordScreen...');
fixForgotPasswordScreen();
console.log('ForgotPasswordScreen fixed successfully!');
