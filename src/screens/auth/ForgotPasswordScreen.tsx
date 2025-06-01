import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, typography } from '../../theme/designSystem';
import { ERROR_MESSAGES } from '../../config/constants';

export const ForgotPasswordScreen = () => {
  const theme = useTheme();
  const { forgotPassword, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Reset errors
    setEmailError('');

    // Validate inputs
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Check Your Email
          </Text>
          <Text variant="bodyLarge" style={styles.message}>
            We've sent password reset instructions to your email address.
          </Text>
          <Button
            mode="contained"
            onPress={() => {/* Navigate to login */}}
            style={styles.button}
          >
            Back to Login
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Forgot Password
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={!!emailError}
          style={styles.input}
        />
        {emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}

        {error ? (
          <Text style={styles.errorText}>{ERROR_MESSAGES.PASSWORD_RESET_FAILED}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Send Reset Instructions
        </Button>

        <Button
          mode="text"
          onPress={() => {/* Navigate to login */}}
          style={styles.backButton}
        >
          Back to Login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.error.main,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
  },
  backButton: {
    marginTop: spacing.sm,
  },
}); 