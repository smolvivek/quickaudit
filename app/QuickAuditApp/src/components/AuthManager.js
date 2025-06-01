import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../redux/slices/authSlice';
import * as Keychain from 'react-native-keychain';
import NetInfo from '@react-native-community/netinfo';

// Import API service
import {login, refreshToken} from '../services/authService';
import {websocketService} from '../services/websocketService';

const AuthManager = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);

  useEffect(() => {
    // Check for existing authentication
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (token) {
      // Initialize WebSocket connection
      websocketService.initialize(token);
    } else {
      // Cleanup WebSocket connection
      websocketService.cleanup();
    }

    return () => {
      websocketService.cleanup();
    };
  }, [token]);

  // Check if user is already authenticated
  const checkAuthentication = async () => {
    try {
      // Try to get tokens from secure storage
      const credentials = await Keychain.getGenericPassword('auth_tokens');

      if (credentials) {
        const {username: tokens} = credentials;
        const parsedTokens = JSON.parse(tokens);

        // Check if tokens exist and not expired
        if (parsedTokens.accessToken && parsedTokens.refreshToken) {
          // Validate token or refresh if needed
          const isValid = await validateToken(parsedTokens);

          if (isValid) {
            // Get user data from storage
            const userData = await AsyncStorage.getItem('user_data');

            if (userData) {
              // Set user in Redux store
              dispatch(setUser(JSON.parse(userData)));
              setIsAuthenticated(true);
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Authentication check error:', error);
      setIsLoading(false);
    }
  };

  // Validate token or refresh if needed
  const validateToken = async tokens => {
    try {
      // Check if access token is expired
      const tokenData = parseJwt(tokens.accessToken);
      const currentTime = Date.now() / 1000;

      if (tokenData.exp > currentTime) {
        // Token is still valid
        return true;
      }

      // Token is expired, try to refresh
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected || !networkState.isInternetReachable) {
        // Offline mode - allow access with expired token
        // In a real app, you might want to limit functionality
        return true;
      }

      // Try to refresh token
      const response = await refreshToken(tokens.refreshToken);

      if (response.success) {
        // Save new tokens
        await Keychain.setGenericPassword(
          'auth_tokens',
          JSON.stringify({
            accessToken: response.token,
            refreshToken: response.refreshToken,
          }),
          {service: 'auth_tokens'},
        );

        return true;
      }

      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Parse JWT token
  const parseJwt = token => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT parse error:', error);
      return {};
    }
  };

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);

      // Mock login for development
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock user data
      const mockUser = {
        id: '1',
        email: email,
        name: 'John Doe',
        role: 'auditor',
        company: 'Acme Corp',
        subscription: {
          plan: 'basic',
          status: 'active',
        },
      };

      // Save user data
      await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));

      // Set user in Redux store
      dispatch(setUser(mockUser));

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Error',
        'An unexpected error occurred. Please try again.',
      );
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear tokens
      await Keychain.resetGenericPassword({service: 'auth_tokens'});

      // Clear user data
      await AsyncStorage.removeItem('user_data');

      // Clear Redux store
      dispatch(setUser(null));

      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // If still loading, show loading screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.text}>Loading QuickAudit...</Text>
      </View>
    );
  }

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} isLoading={isLoading} />;
  }

  // Render children with auth context
  return React.cloneElement(children, {onLogout: handleLogout});
};

// Login Screen Component
const LoginScreen = ({onLogin, isLoading}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert(
        'Missing Information',
        'Please enter both email and password',
      );
      return;
    }

    onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuickAudit</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#4b5563',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#4b5563',
  },
});

export default AuthManager;
