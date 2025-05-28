import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plan: null,
  status: null, // 'active', 'trial', 'expired', 'canceled'
  startDate: null,
  endDate: null,
  trialEnd: null,
  paymentMethod: null,
  billingHistory: []
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    updateSubscription: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    },
    addPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    addBillingRecord: (state, action) => {
      state.billingHistory.push(action.payload);
    },
    clearSubscription: (state) => {
      return initialState;
    }
  }
});

export const {
  updateSubscription,
  addPaymentMethod,
  addBillingRecord,
  clearSubscription
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
