/**
 * Register Screen
 * Screen for new users to create an account
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
  HelperText,
  Checkbox
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    agreeToTerms: ''
  });
  
  const validateEmail = (email) => {
    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    // Password must be at least 8 characters and contain at least one number, one uppercase letter, and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      agreeToTerms: ''
    };
    
    let isValid = true;
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters and contain at least one number, one uppercase letter, and one special character';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (!company.trim()) {
      newErrors.company = 'Company name is required';
      isValid = false;
    }
    
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms and Privacy Policy';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to register the user
      // For now, we'll simulate a successful registration
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully. Please log in with your credentials.',
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
      Alert.alert('Registration Failed', 'An error occurred during registration. Please try again.');
    }
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };
  
  const navigateToTerms = () => {
    navigation.navigate('Terms');
  };
  
  const navigateToPrivacy = () => {
    navigation.navigate('Privacy');
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
          <Text style={styles.tagline}>Create your account</Text>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            error={!!errors.fullName}
            mode="outlined"
            outlineColor={appTheme.colors.outline}
            activeOutlineColor={appTheme.colors.primary}
          />
          {!!errors.fullName && (
            <HelperText type="error" visible={!!errors.fullName}>
              {errors.fullName}
            </HelperText>
          )}
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={!!errors.email}
            mode="outlined"
            outlineColor={appTheme.colors.outline}
            activeOutlineColor={appTheme.colors.primary}
          />
          {!!errors.email && (
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          )}
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            error={!!errors.password}
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
          {!!errors.password && (
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
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
          
          <TextInput
            label="Company"
            value={company}
            onChangeText={setCompany}
            style={styles.input}
            error={!!errors.company}
            mode="outlined"
            outlineColor={appTheme.colors.outline}
            activeOutlineColor={appTheme.colors.primary}
          />
          {!!errors.company && (
            <HelperText type="error" visible={!!errors.company}>
              {errors.company}
            </HelperText>
          )}
          
          <View style={styles.termsContainer}>
            <Checkbox
              status={agreeToTerms ? 'checked' : 'unchecked'}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              color={appTheme.colors.primary}
            />
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink} onPress={navigateToTerms}>
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text style={styles.termsLink} onPress={navigateToPrivacy}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
          {!!errors.agreeToTerms && (
            <HelperText type="error" visible={!!errors.agreeToTerms}>
              {errors.agreeToTerms}
            </HelperText>
          )}
          
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.registerButton}
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
          
          <View style={styles.loginContainer}>
            <Text style={styles.haveAccountText}>Already have an account?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
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
  input: {
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
  },
  termsLink: {
    fontSize: 14,
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: appTheme.colors.primary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  haveAccountText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  loginText: {
    fontSize: 14,
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;