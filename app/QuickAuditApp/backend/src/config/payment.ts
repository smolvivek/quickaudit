import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import paypal from '@paypal/checkout-server-sdk';

dotenv.config();

// Razorpay Configuration
export const razorpay = new Razorpay({
  key_id: 'rzp_test_YfuuR9BOe3ZWsB',
  key_secret: 'BhxT2QNEAkFYCBy6lijbKV6d6',
});

// PayPal Configuration
const environment = new paypal.core.SandboxEnvironment(
  'AUUDtpE310Akz52uQx5U6EnK3FmXT2ww7iWszeTZ_b3GwwAF8li5FivyljFZmOe1pAgFw9Lk08QfbbtG',
  'EPa8SyisWPcv1eCbsOlpl_ZL1sGqpY9WW5-tkvnLEdcAMbyX7ySmmWOQKHiHNHmPqpBS7F26nqMWh9',
);
export const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Subscription Plans
export const subscriptionPlans = {
  basic: {
    monthly: {
      inr: 2499,
      usd: 29,
    },
    annual: {
      inr: 24990,
      usd: 290,
    },
  },
  pro: {
    monthly: {
      inr: 4999,
      usd: 59,
    },
    annual: {
      inr: 49990,
      usd: 590,
    },
  },
  enterprise: {
    monthly: {
      inr: 8999,
      usd: 99,
    },
    annual: {
      inr: 89990,
      usd: 990,
    },
  },
};

// Add-on Services
export const addonServices = {
  customTemplates: {
    inr: 999,
    usd: 10,
  },
  prioritySupport: {
    inr: 1499,
    usd: 15,
  },
  apiAccess: {
    inr: 1999,
    usd: 20,
  },
};
