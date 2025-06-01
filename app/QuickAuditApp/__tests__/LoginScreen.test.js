import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginScreen from '../src/screens/auth/LoginScreen';

// Mock the navigation
const mockNavigate = jest.fn();
const navigation = {
  navigate: mockNavigate,
};

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  auth: {
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false,
  },
};

describe('LoginScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByText, getByPlaceholderText} = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    // Check if important elements are rendered
    expect(getByText('Sign in to your account')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('handles input changes', () => {
    const {getByPlaceholderText} = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows validation errors for empty fields', () => {
    const {getByText} = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    // Try to submit without entering data
    fireEvent.press(getByText('Sign In'));

    // Check if validation error is shown
    expect(getByText('Please enter both email and password')).toBeTruthy();
  });

  it('dispatches login action on form submission', () => {
    const {getByText, getByPlaceholderText} = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    // Enter login data
    fireEvent.changeText(
      getByPlaceholderText('Enter your email'),
      'test@example.com',
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter your password'),
      'password123',
    );

    // Submit the form
    fireEvent.press(getByText('Sign In'));

    // Check if the login action was dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('auth/loginRequest');
    expect(actions[0].payload).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('shows loading indicator when authentication is in progress', () => {
    const loadingState = {
      auth: {
        loading: true,
        error: null,
        user: null,
        isAuthenticated: false,
      },
    };
    const loadingStore = mockStore(loadingState);

    const {getByTestId} = render(
      <Provider store={loadingStore}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    // Check if loading indicator is shown
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows error message when authentication fails', () => {
    const errorState = {
      auth: {
        loading: false,
        error: 'Invalid credentials',
        user: null,
        isAuthenticated: false,
      },
    };
    const errorStore = mockStore(errorState);

    const {getByText} = render(
      <Provider store={errorStore}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    // Check if error message is shown
    expect(getByText('Invalid credentials')).toBeTruthy();
  });

  it('navigates to dashboard when already authenticated', () => {
    const authenticatedState = {
      auth: {
        loading: false,
        error: null,
        user: {id: '1', name: 'Test User'},
        isAuthenticated: true,
      },
    };
    const authenticatedStore = mockStore(authenticatedState);

    render(
      <Provider store={authenticatedStore}>
        <LoginScreen navigation={navigation} />
      </Provider>,
    );

    // Check if navigation to dashboard occurred
    expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
  });
});
