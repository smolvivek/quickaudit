import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Checkbox from '../components/Checkbox';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import Logo from '../assets/images/logo';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../App';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Validation schema
const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  company: Yup.string()
    .min(2, 'Company name is too short')
    .required('Company name is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

// Function to calculate password strength (0-100)
const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 20;
  else if (password.length >= 6) strength += 10;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 20;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 20;
  
  // Contains number
  if (/[0-9]/.test(password)) strength += 20;
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
  return Math.min(100, strength);
};

const RegisterScreen = ({ navigation }) => {
  const { colors, typography } = useTheme();
  const { signIn } = useContext(AuthContext);
  
  // Create styles using the theme
  const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingBottom: 24,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    logoWrapper: {
      marginBottom: 16,
    },
    appName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.primary,
    },
    formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    instructionText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    errorContainer: {
    backgroundColor: colors.error + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
    errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
    inputGroup: {
      marginBottom: 16,
    },
    passwordStrengthContainer: {
      marginTop: 8,
      marginBottom: 16,
    },
    passwordStrengthText: {
      fontSize: 12,
      marginBottom: 4,
      color: colors.textSecondary,
    },
    passwordStrengthBar: {
      height: 4,
      borderRadius: 2,
      backgroundColor: '#E0E0E0',
    },
    passwordStrengthIndicator: {
      height: '100%',
      borderRadius: 2,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    checkboxText: {
      flex: 1,
      marginLeft: 8,
      fontSize: 14,
      color: colors.textSecondary,
    },
    termsText: {
      color: colors.primary,
      fontWeight: '500',
    },
    buttonContainer: {
      marginBottom: 16,
    },
    footerContainer: {
      alignItems: 'center',
      marginTop: 16,
    },
    footerText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    footerLink: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
  });
  
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-100 for strength bar
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Listen for keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  
  // Handle registration
  const handleRegister = async (values) => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, simulate successful registration
      // In a real app, you would get a token from your API
      await signIn('dummy-auth-token');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text, ...typography.h2 }]}>Sign Up</Text>
            <View style={styles.placeholder} />
          </View>
          
          <Animatable.View 
            animation="fadeIn"
            duration={800}
            style={styles.formContainer}
          >
            <Text style={[styles.welcomeText, { color: colors.text, ...typography.h1 }]}>Create your account</Text>
            
            {error ? (
              <Animatable.View
                animation="shake"
                duration={500}
                style={styles.errorContainer}
              >
                <Text style={styles.errorText}>{error}</Text>
              </Animatable.View>
            ) : null}
            
            <Formik
              initialValues={{ 
                fullName: '', 
                email: '', 
                company: '', 
                password: '', 
                confirmPassword: '' 
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <View style={styles.form}>
                  <FormInput
                    label="Full Name"
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    placeholder="Enter your full name"
                    error={errors.fullName}
                    touched={touched.fullName}
                    icon="person-outline"
                    autoCapitalize="words"
                  />
                  
                  <FormInput
                    label="Email Address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Enter your email address"
                    error={errors.email}
                    touched={touched.email}
                    keyboardType="email-address"
                    icon="mail-outline"
                  />
                  
                  <FormInput
                    label="Company Name"
                    value={values.company}
                    onChangeText={handleChange('company')}
                    onBlur={handleBlur('company')}
                    placeholder="Enter your company name"
                    error={errors.company}
                    touched={touched.company}
                    icon="business-outline"
                    autoCapitalize="words"
                  />
                  
                  <FormInput
                    label="Password"
                    value={values.password}
                    onChangeText={(text) => {
                      handleChange('password')(text);
                      // Calculate password strength (simple version)
                      const strength = calculatePasswordStrength(text);
                      setPasswordStrength(strength);
                    }}
                    onBlur={handleBlur('password')}
                    placeholder="Create a password"
                    error={errors.password}
                    touched={touched.password}
                    secureTextEntry
                    icon="lock-closed-outline"
                  />
                  
                  {values.password && (
                    <PasswordStrengthIndicator strength={passwordStrength} />
                  )}
                  
                  <FormInput
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    secureTextEntry
                    icon="lock-closed-outline"
                  />
                  
                  <View style={styles.termsContainer}>
                    <Checkbox
                      checked={termsAccepted}
                      onPress={() => setTermsAccepted(!termsAccepted)}
                      style={styles.checkbox}
                    />
                    <Text style={styles.termsText}>
                      I agree to the{' '}
                      <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                      <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                  </View>
                  
                  <Button
                    title="Create Account"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!isValid || !termsAccepted}
                    fullWidth={true}
                    style={styles.registerButton}
                  />
                </View>
              )}
            </Formik>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
          
          {!isKeyboardVisible && (
            <Animatable.View
              animation="fadeIn"
              duration={1000}
              delay={1000}
              style={styles.footer}
            >
              <Text style={styles.footerText}>
                © 2025 QuickAudit. All rights reserved.
              </Text>
            </Animatable.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
