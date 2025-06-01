/**
 * Reset Password Screen
 * Screen for users to reset their password
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

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email } = route.params || { email: '' };
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const validatePassword = (password) => {
    // Password must be at least 8 characters and contain at least one number, one uppercase letter, and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const validateForm = () => {
    const newErrors = {
      resetCode: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    let isValid = true;
    
    if (!resetCode.trim()) {
      newErrors.resetCode = 'Reset code is required';
      isValid = false;
    } else if (resetCode.length !== 6) {
      newErrors.resetCode = 'Reset code must be 6 digits';
      isValid = false;
    }
    
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters and contain at least one number, one uppercase letter, and one special character';
      isValid = false;
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to reset the password
      // For now, we'll simulate a successful password reset
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Password Reset Successful',
          'Your password has been reset successfully. Please log in with your new password.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      }, 2000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Password Reset Failed', 'An error occurred during password reset. Please try again.');
    }
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
        
        <View style={styles.formContainer}>
          <Text style={styles.instructionText}>
            Enter the 6-digit code sent to your email and create a new password.
          </Text>
          
          <TextInput
            label="Reset Code"
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            error={!!errors.resetCode}
            mode="outlined"
            outlineColor={appTheme.colors.outline}
            activeOutlineColor={appTheme.colors.primary}
          />
          {!!errors.resetCode && (
            <HelperText type="error" visible={!!errors.resetCode}>
              {errors.resetCode}
            </HelperText>
          )}
          
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            error={!!errors.newPassword}
            mode="outlined"
            outlineColor={appTheme.colors.outline}
            activeOutlineColor={appTheme.colors.primary}
            right={
              <TextInput.Icon
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {!!errors.newPassword && (
            <HelperText type="error" visible={!!errors.newPassword}>
              {errors.newPassword}
            </HelperText>
          )}
          
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            error={!!errors.confirmPassword}
            mode="outlined"
            outlineColor={appTheme.colors.outline}
            activeOutlineColor={appTheme.colors.primary}
            right={
              <TextInput.Icon
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {!!errors.confirmPassword && (
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>
          )}
          
          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={styles.resetButton}
            loading={loading}
            disabled={loading}
          >
            Reset Password
          </Button>
          
          <TouchableOpacity onPress={navigateToLogin} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 20,
    marginBottom: 30,
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
});

export default ResetPasswordScreen;