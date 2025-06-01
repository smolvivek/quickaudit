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
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Logo from '../assets/images/logo';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../App';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const { colors, typography } = useTheme();
  const { signIn } = useContext(AuthContext);
  
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  
  // Handle login
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any non-empty credentials
      // In a real app, this would be an API call to your backend
      if (values.email && values.password) {
        // In a real app, you would get a token from your API
        await signIn('dummy-auth-token');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
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
            <Text style={[styles.headerTitle, { color: colors.text, ...typography.h2 }]}>Sign In</Text>
          </View>
          
          <View style={styles.logoContainer}>
            <Animatable.View
              animation="fadeIn"
              duration={1000}
              style={styles.logoWrapper}
            >
              <Logo width={100} height={100} />
            </Animatable.View>
            
            <Animatable.Text
              animation="fadeInUp"
              duration={1000}
              delay={300}
              style={[styles.appName, { color: colors.text, ...typography.h1 }]}
            >
              QuickAudit
            </Animatable.Text>
          </View>
          
          <Animatable.View 
            animation="fadeIn"
            duration={800}
            style={styles.formContainer}
          >
            <Text style={[styles.welcomeText, { color: colors.text, ...typography.h3 }]}>Welcome Back</Text>
            <Text style={[styles.instructionText, { color: colors.textSecondary, ...typography.body }]}>Sign in to continue</Text>
            
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
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
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
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder="Enter your password"
                    error={errors.password}
                    touched={touched.password}
                    secureTextEntry
                    icon="lock-closed-outline"
                  />
                  
                  <TouchableOpacity
                    style={styles.forgotPasswordContainer}
                    onPress={() => {}}
                  >
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                  
                  <Button
                    title="Sign In"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!isValid}
                    fullWidth={true}
                    style={styles.loginButton}
                  />
                </View>
              )}
            </Formik>
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>
            
            <Button
              title="Continue as Guest"
              type="outline"
              onPress={() => navigation.replace('Main')}
              fullWidth={true}
              style={styles.guestButton}
            />
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.signupLink, { color: colors.primary }]}>Sign Up</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },
  logoWrapper: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
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
    color: COLORS.text,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: colors.error + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  guestButton: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 24,
  },
});

export default LoginScreen;
