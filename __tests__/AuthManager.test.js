import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AuthManager from '../src/components/AuthManager';

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null
  }
};

// Mock child component
const MockChildComponent = () => <></>;

describe('AuthManager', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders login screen when not authenticated', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <AuthManager>
          <MockChildComponent testID="child-component" />
        </AuthManager>
      </Provider>
    );

    // Check if login screen is rendered instead of children
    expect(() => getByTestId('child-component')).toThrow();
    expect(getByTestId('login-screen')).toBeTruthy();
  });

  it('renders children when authenticated', () => {
    const authenticatedState = {
      auth: {
        ...initialState.auth,
        isAuthenticated: true,
        user: { id: '1', name: 'Test User' },
        token: 'valid-token'
      }
    };
    const authenticatedStore = mockStore(authenticatedState);

    const { getByTestId } = render(
      <Provider store={authenticatedStore}>
        <AuthManager>
          <MockChildComponent testID="child-component" />
        </AuthManager>
      </Provider>
    );

    // Check if children are rendered
    expect(getByTestId('child-component')).toBeTruthy();
  });

  it('checks token expiration and refreshes when needed', async () => {
    // Set up a store with an expired token
    const expiredTokenState = {
      auth: {
        ...initialState.auth,
        isAuthenticated: true,
        user: { id: '1', name: 'Test User' },
        token: 'expired-token',
        refreshToken: 'valid-refresh-token',
        tokenExpiration: new Date(Date.now() - 1000).toISOString() // Token expired 1 second ago
      }
    };
    const expiredTokenStore = mockStore(expiredTokenState);

    render(
      <Provider store={expiredTokenStore}>
        <AuthManager>
          <MockChildComponent testID="child-component" />
        </AuthManager>
      </Provider>
    );

    // Wait for token refresh check
    await waitFor(() => {
      // Check if refresh token action was dispatched
      const actions = expiredTokenStore.getActions();
      expect(actions.some(action => action.type === 'auth/refreshToken')).toBe(true);
    });
  });

  it('does not refresh token when not expired', async () => {
    // Set up a store with a valid token
    const validTokenState = {
      auth: {
        ...initialState.auth,
        isAuthenticated: true,
        user: { id: '1', name: 'Test User' },
        token: 'valid-token',
        refreshToken: 'valid-refresh-token',
        tokenExpiration: new Date(Date.now() + 3600000).toISOString() // Token expires in 1 hour
      }
    };
    const validTokenStore = mockStore(validTokenState);

    render(
      <Provider store={validTokenStore}>
        <AuthManager>
          <MockChildComponent testID="child-component" />
        </AuthManager>
      </Provider>
    );

    // Wait for token refresh check
    await waitFor(() => {
      // Check that refresh token action was not dispatched
      const actions = validTokenStore.getActions();
      expect(actions.some(action => action.type === 'auth/refreshToken')).toBe(false);
    });
  });

  it('logs out when refresh token fails', async () => {
    // Set up a store with an expired token and invalid refresh token
    const invalidRefreshState = {
      auth: {
        ...initialState.auth,
        isAuthenticated: true,
        user: { id: '1', name: 'Test User' },
        token: 'expired-token',
        refreshToken: 'invalid-refresh-token',
        tokenExpiration: new Date(Date.now() - 1000).toISOString(), // Token expired 1 second ago
        refreshError: 'Invalid refresh token'
      }
    };
    const invalidRefreshStore = mockStore(invalidRefreshState);

    render(
      <Provider store={invalidRefreshStore}>
        <AuthManager>
          <MockChildComponent testID="child-component" />
        </AuthManager>
      </Provider>
    );

    // Wait for token refresh check and logout
    await waitFor(() => {
      // Check if logout action was dispatched
      const actions = invalidRefreshStore.getActions();
      expect(actions.some(action => action.type === 'auth/logout')).toBe(true);
    });
  });

  it('shows loading indicator during authentication', () => {
    const loadingState = {
      auth: {
        ...initialState.auth,
        loading: true
      }
    };
    const loadingStore = mockStore(loadingState);

    const { getByTestId } = render(
      <Provider store={loadingStore}>
        <AuthManager>
          <MockChildComponent testID="child-component" />
        </AuthManager>
      </Provider>
    );

    // Check if loading indicator is shown
    expect(getByTestId('auth-loading')).toBeTruthy();
  });

  it('shows error message when authentication fails', () => {
    const errorState = {
      auth: {
        ...initialState.auth,
        error: 'Authentication failed'
      }
    };
    const errorStore = mockStore(errorState);

    const { getByText } = render(
      <Provider store={errorStore}>
        <AuthManager>
          <MockChildComponent testID="child-component" />
        </AuthManager>
      </Provider>
    );

    // Check if error message is shown
    expect(getByText('Authentication failed')).toBeTruthy();
  });
});
