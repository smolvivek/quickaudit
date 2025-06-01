/**
 * Signup Screen
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
  Checkbox,
  HelperText,
  Divider
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appTheme } from '../../theme/webAppTheme';

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phoneNumber: '',
    agreeToTerms: ''
  });
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters and contain at least one number, one uppercase letter, and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      phoneNumber: '',
      agreeToTerms: ''
    };
    
    let isValid = true;
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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
    
    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
      isValid = false;
    }
    
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms and Conditions';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSignup = async () => {
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
          'Your account has been created successfully. Please check your email for verification.',
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
  
  const navigateToPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
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
          <Text style={styles.tagline}>Streamline your audit process</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Title style={styles.formTitle}>Create Account</Title>
          
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <TextInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                error={!!errors.firstName}
                mode="outlined"
                outlineColor={appTheme.colors.outline}
                activeOutlineColor={appTheme.colors.primary}
              />
              {!!errors.firstName && (
                <HelperText type="error" visible={!!errors.firstName}>
                  {errors.firstName}
                </HelperText>
              )}
            </View>
            
            <View style={styles.nameField}>
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
                error={!!errors.lastName}
                mode="outlined"
                outlineColor={appTheme.colors.outline}
                activeOutlineColor={appTheme.colors.primary}
              />
              {!!errors.lastName && (
                <HelperText type="error" visible={!!errors.lastName}>
                  {errors.lastName}
                </HelperText>
              )}
            </View>
          </View>
          
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
            label="Company Name"
            value={companyName}
            onChangeText={setCompanyName}
            style={styles.input}
            error={!!errors.companyName}
            mode="outlined"
            outlineColor={appTheme.colors.outline}
            activeOutlineColor={appTheme.colors.primary}
          />
          {!!errors.companyName && (
            <HelperText type="error" visible={!!errors.companyName}>
              {errors.companyName}
            </HelperText>
          )}
          
          <TextInput
            label="Phone Number (Optional)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            mode="outlined"
            outlineColor={appTheme.colors.outline}
            activeOutlineColor={appTheme.colors.primary}
          />
          
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
                  Terms and Conditions
                </Text>{' '}
                and{' '}
                <Text style={styles.termsLink} onPress={navigateToPrivacyPolicy}>
                  Privacy Policy
                </Text>
              </Text>
              {!!errors.agreeToTerms && (
                <HelperText type="error" visible={!!errors.agreeToTerms}>
                  {errors.agreeToTerms}
                </HelperText>
              )}
            </View>
          </View>
          
          <Button
            mode="contained"
            onPress={handleSignup}
            style={styles.signupButton}
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
          
          <Divider style={styles.divider} />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Log In</Text>
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
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
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
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: appTheme.colors.primary,
  },
  divider: {
    marginVertical: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    color: appTheme.colors.primary,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
