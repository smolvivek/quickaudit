import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import SubscriptionScreen from '../src/screens/SubscriptionScreen';

// Mock the navigation
const mockNavigate = jest.fn();
const navigation = {
  navigate: mockNavigate,
};

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  subscription: {
    plan: null,
    status: null,
    startDate: null,
    endDate: null,
    trialEnd: null,
  },
  auth: {
    user: {id: '1', name: 'Test User'},
  },
};

describe('SubscriptionScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders correctly with no subscription', () => {
    const {getByText, getAllByText} = render(
      <Provider store={store}>
        <SubscriptionScreen navigation={navigation} />
      </Provider>,
    );

    // Check if important elements are rendered
    expect(getByText('Subscription Plans')).toBeTruthy();
    expect(getByText('No Active Subscription')).toBeTruthy();
    expect(getByText('Start Free Trial')).toBeTruthy();
    expect(getAllByText('Available Plans').length).toBeGreaterThan(0);
  });

  it('renders all subscription plans', () => {
    const {getByText} = render(
      <Provider store={store}>
        <SubscriptionScreen navigation={navigation} />
      </Provider>,
    );

    // Check if all plan options are rendered
    expect(getByText('Basic')).toBeTruthy();
    expect(getByText('Professional')).toBeTruthy();
    expect(getByText('Enterprise')).toBeTruthy();
  });

  it('shows trial status when on trial', () => {
    const trialState = {
      ...initialState,
      subscription: {
        plan: {
          id: 'professional',
          name: 'Professional',
          price: 29.99,
          interval: 'month',
        },
        status: 'trial',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };
    const trialStore = mockStore(trialState);

    const {getByText} = render(
      <Provider store={trialStore}>
        <SubscriptionScreen navigation={navigation} />
      </Provider>,
    );

    // Check if trial status is shown
    expect(getByText('Trial Active')).toBeTruthy();
    expect(getByText('Subscribe Now')).toBeTruthy();
  });

  it('shows active subscription details when subscribed', () => {
    const subscribedState = {
      ...initialState,
      subscription: {
        plan: {
          id: 'professional',
          name: 'Professional',
          price: 29.99,
          interval: 'month',
        },
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };
    const subscribedStore = mockStore(subscribedState);

    const {getByText} = render(
      <Provider store={subscribedStore}>
        <SubscriptionScreen navigation={navigation} />
      </Provider>,
    );

    // Check if subscription details are shown
    expect(getByText('Active Subscription')).toBeTruthy();
    expect(getByText('View Billing History')).toBeTruthy();
  });

  it('handles plan selection', () => {
    const {getByText, getAllByText} = render(
      <Provider store={store}>
        <SubscriptionScreen navigation={navigation} />
      </Provider>,
    );

    // Select a plan
    fireEvent.press(getByText('Professional'));

    // Check if subscribe button appears
    expect(getAllByText('Subscribe Now').length).toBeGreaterThan(0);
  });

  it('dispatches trial start action', () => {
    const {getByText} = render(
      <Provider store={store}>
        <SubscriptionScreen navigation={navigation} />
      </Provider>,
    );

    // Start free trial
    fireEvent.press(getByText('Start Free Trial'));

    // Check if the action was dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('subscription/updateSubscription');
    expect(actions[0].payload.status).toBe('trial');
  });

  it('dispatches subscription action when subscribing', () => {
    const {getByText} = render(
      <Provider store={store}>
        <SubscriptionScreen navigation={navigation} />
      </Provider>,
    );

    // Select a plan
    fireEvent.press(getByText('Professional'));

    // Subscribe
    fireEvent.press(getByText('Subscribe Now'));

    // Check if the action was dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('subscription/updateSubscription');
    expect(actions[0].payload.status).toBe('active');
  });

  it('navigates to payment method screen if no payment method', () => {
    const {getByText} = render(
      <Provider store={store}>
        <SubscriptionScreen navigation={navigation} />
      </Provider>,
    );

    // Select a plan
    fireEvent.press(getByText('Professional'));

    // Subscribe
    fireEvent.press(getByText('Subscribe Now'));

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('PaymentMethod', {
      returnTo: 'Subscription',
    });
  });
});
