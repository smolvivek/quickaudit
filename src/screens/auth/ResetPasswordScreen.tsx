import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, typography } from '../../theme/designSystem';
import { ERROR_MESSAGES } from '../../config/constants';

export const ResetPasswordScreen = () => {
  const theme = useTheme();
  const { resetPassword, isLoading, error } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    // Reset errors
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate inputs
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    try {
      await resetPassword(password);
      // Navigate to login on success
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Reset Password
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Enter your new password below.
        </Text>

        <TextInput
          label="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={!!passwordError}
          style={styles.input}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TextInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={!!confirmPasswordError}
          style={styles.input}
        />
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
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
          Reset Password
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
}); 