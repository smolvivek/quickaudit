import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import BillingHistoryScreen from '../src/screens/BillingHistoryScreen';

// Mock the navigation
const mockNavigate = jest.fn();
const navigation = {
  navigate: mockNavigate,
};

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  subscription: {
    plan: {
      id: 'professional',
      name: 'Professional',
      price: 29.99,
      interval: 'month',
    },
    status: 'active',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: {
      id: 'pm_123456789',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      name: 'John Doe',
    },
    billingHistory: [
      {
        id: 'inv_001',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29.99,
        status: 'paid',
        description: 'Professional Plan - Monthly Subscription',
      },
      {
        id: 'inv_002',
        date: new Date().toISOString(),
        amount: 29.99,
        status: 'paid',
        description: 'Professional Plan - Monthly Subscription',
      },
    ],
  },
};

describe('BillingHistoryScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders correctly with subscription and payment method', () => {
    const {getByText} = render(
      <Provider store={store}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Check if important elements are rendered
    expect(getByText('Billing & Subscription')).toBeTruthy();
    expect(getByText('Current Subscription')).toBeTruthy();
    expect(getByText('Professional Plan')).toBeTruthy();
    expect(getByText('Payment Method')).toBeTruthy();
    expect(getByText('Visa ending in 4242')).toBeTruthy();
    expect(getByText('Billing History')).toBeTruthy();
  });

  it('displays subscription status correctly', () => {
    const {getByText} = render(
      <Provider store={store}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Check subscription status
    expect(getByText('Status: Active')).toBeTruthy();

    // Check next billing date
    const endDate = new Date(initialState.subscription.endDate);
    const formattedDate = endDate.toLocaleDateString();
    expect(getByText(`Next billing date: ${formattedDate}`)).toBeTruthy();
  });

  it('displays billing history correctly', () => {
    const {getAllByText} = render(
      <Provider store={store}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Check if both invoices are displayed
    expect(
      getAllByText('Professional Plan - Monthly Subscription').length,
    ).toBe(2);
    expect(getAllByText('$29.99').length).toBe(3); // 2 in history + 1 in subscription details
    expect(getAllByText('Paid').length).toBe(2);
  });

  it('navigates to payment method screen when change button is pressed', () => {
    const {getByText} = render(
      <Provider store={store}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Press change payment method button
    fireEvent.press(getByText('Change'));

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('PaymentMethod');
  });

  it('navigates to subscription screen when manage subscription button is pressed', () => {
    const {getByText} = render(
      <Provider store={store}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Press manage subscription button
    fireEvent.press(getByText('Manage Subscription'));

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('Subscription');
  });

  it('shows invoice details when an invoice is pressed', () => {
    // Mock Alert
    global.Alert = {
      alert: jest.fn(),
    };

    const {getAllByText} = render(
      <Provider store={store}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Press on the first invoice
    fireEvent.press(
      getAllByText('Professional Plan - Monthly Subscription')[0],
    );

    // Check if Alert was called with invoice details
    expect(global.Alert.alert).toHaveBeenCalled();
    expect(global.Alert.alert.mock.calls[0][0]).toBe('Invoice Details');
    expect(global.Alert.alert.mock.calls[0][1]).toContain('inv_001');
    expect(global.Alert.alert.mock.calls[0][1]).toContain('$29.99');
    expect(global.Alert.alert.mock.calls[0][1]).toContain('Paid');
  });

  it('renders correctly with no payment method', () => {
    const noPaymentState = {
      ...initialState,
      subscription: {
        ...initialState.subscription,
        paymentMethod: null,
      },
    };
    const noPaymentStore = mockStore(noPaymentState);

    const {getByText} = render(
      <Provider store={noPaymentStore}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Check if no payment method message is shown
    expect(getByText('No payment method on file')).toBeTruthy();
    expect(getByText('Add Payment Method')).toBeTruthy();
  });

  it('renders correctly with no billing history', () => {
    const noHistoryState = {
      ...initialState,
      subscription: {
        ...initialState.subscription,
        billingHistory: [],
      },
    };
    const noHistoryStore = mockStore(noHistoryState);

    const {getByText} = render(
      <Provider store={noHistoryStore}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Check if no history message is shown
    expect(getByText('No billing history available')).toBeTruthy();
  });

  it('renders correctly with trial subscription', () => {
    const trialState = {
      ...initialState,
      subscription: {
        ...initialState.subscription,
        status: 'trial',
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      },
    };
    const trialStore = mockStore(trialState);

    const {getByText} = render(
      <Provider store={trialStore}>
        <BillingHistoryScreen navigation={navigation} />
      </Provider>,
    );

    // Check if trial status is shown
    expect(getByText('Status: Trial')).toBeTruthy();

    // Check trial end date
    const trialEnd = new Date(trialState.subscription.trialEnd);
    const formattedDate = trialEnd.toLocaleDateString();
    expect(getByText(`Trial ends on ${formattedDate}`)).toBeTruthy();
  });
});
