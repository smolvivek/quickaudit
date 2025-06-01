import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import PaymentMethodScreen from '../src/screens/PaymentMethodScreen';

// Mock the navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

// Mock route params
const route = {
  params: {
    returnTo: 'Subscription',
  },
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
    status: 'trial',
    paymentMethod: null,
  },
  auth: {
    user: {id: '1', name: 'Test User'},
  },
};

// Mock Stripe hooks
jest.mock('@stripe/stripe-react-native', () => ({
  CardField: ({onCardChange, ...props}) => (
    <div
      data-testid="mock-card-field"
      onChange={() =>
        onCardChange({complete: true, brand: 'visa', last4: '4242'})
      }
      {...props}
    />
  ),
  useStripe: () => ({
    createPaymentMethod: jest.fn().mockResolvedValue({
      paymentMethod: {
        id: 'pm_123456789',
        card: {
          brand: 'visa',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2025,
        },
      },
    }),
    loading: false,
  }),
  useConfirmPayment: () => ({
    confirmPayment: jest
      .fn()
      .mockResolvedValue({paymentIntent: {id: 'pi_123456789'}}),
    loading: false,
  }),
}));

describe('PaymentMethodScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByText, getByPlaceholderText} = render(
      <Provider store={store}>
        <PaymentMethodScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Check if important elements are rendered
    expect(getByText('Add Payment Method')).toBeTruthy();
    expect(getByText('Cardholder Name')).toBeTruthy();
    expect(getByPlaceholderText('Name on card')).toBeTruthy();
    expect(getByText('Card Information')).toBeTruthy();
  });

  it('handles input changes', () => {
    const {getByPlaceholderText} = render(
      <Provider store={store}>
        <PaymentMethodScreen navigation={navigation} route={route} />
      </Provider>,
    );

    const nameInput = getByPlaceholderText('Name on card');
    fireEvent.changeText(nameInput, 'John Doe');
    expect(nameInput.props.value).toBe('John Doe');
  });

  it('validates cardholder name', () => {
    const {getByText} = render(
      <Provider store={store}>
        <PaymentMethodScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Try to submit without entering name
    fireEvent.press(getByText('Add Payment Method'));
    expect(getByText('Please enter the cardholder name')).toBeTruthy();
  });

  it('dispatches addPaymentMethod action on successful submission', async () => {
    const {getByText, getByPlaceholderText, getByTestId} = render(
      <Provider store={store}>
        <PaymentMethodScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Enter cardholder name
    fireEvent.changeText(getByPlaceholderText('Name on card'), 'John Doe');

    // Simulate card field completion
    fireEvent.press(getByTestId('mock-card-field'));

    // Submit the form
    fireEvent.press(getByText('Add Payment Method'));

    // Wait for async operations
    await waitFor(() => {
      // Check if the action was dispatched
      const actions = store.getActions();
      expect(actions[0].type).toBe('subscription/addPaymentMethod');
      expect(actions[0].payload.brand).toBe('visa');
      expect(actions[0].payload.last4).toBe('4242');
      expect(actions[0].payload.name).toBe('John Doe');
    });

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('Subscription');
  });

  it('shows error message on payment method creation failure', async () => {
    // Mock Stripe hook to return error
    require('@stripe/stripe-react-native').useStripe = () => ({
      createPaymentMethod: jest.fn().mockResolvedValue({
        error: {message: 'Invalid card number'},
        paymentMethod: null,
      }),
      loading: false,
    });

    const {getByText, getByPlaceholderText, getByTestId} = render(
      <Provider store={store}>
        <PaymentMethodScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Enter cardholder name
    fireEvent.changeText(getByPlaceholderText('Name on card'), 'John Doe');

    // Simulate card field completion
    fireEvent.press(getByTestId('mock-card-field'));

    // Submit the form
    fireEvent.press(getByText('Add Payment Method'));

    // Wait for async operations
    await waitFor(() => {
      // Check if error message is shown
      expect(getByText('Invalid card number')).toBeTruthy();
    });

    // Check that navigation did not occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', () => {
    // Mock Stripe hook to show loading
    require('@stripe/stripe-react-native').useStripe = () => ({
      createPaymentMethod: jest
        .fn()
        .mockImplementation(
          () => new Promise(resolve => setTimeout(resolve, 1000)),
        ),
      loading: true,
    });

    const {getByText, getByPlaceholderText, getByTestId} = render(
      <Provider store={store}>
        <PaymentMethodScreen navigation={navigation} route={route} />
      </Provider>,
    );

    // Enter cardholder name
    fireEvent.changeText(getByPlaceholderText('Name on card'), 'John Doe');

    // Simulate card field completion
    fireEvent.press(getByTestId('mock-card-field'));

    // Submit the form
    fireEvent.press(getByText('Add Payment Method'));

    // Check if button is in loading state
    expect(getByText('Add Payment Method').props.loading).toBe(true);
    expect(getByText('Add Payment Method').props.disabled).toBe(true);
  });
});
