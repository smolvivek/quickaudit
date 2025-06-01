import {Request, Response} from 'express';
import {
  razorpay,
  paypalClient,
  subscriptionPlans,
  addonServices,
} from '../config/payment';
import {Subscription} from '../models/subscription';
import {User} from '../models/user';

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const {planType, billingCycle, currency, addons} = req.body;
    const userId = req.user.id;

    // Get user's country to determine payment gateway
    const user = await User.findById(userId);
    const isIndianUser = user?.country === 'IN';

    if (isIndianUser) {
      // Razorpay subscription
      const amount = subscriptionPlans[planType][billingCycle].inr;
      const subscription = await razorpay.subscriptions.create({
        plan_id: `plan_${planType}_${billingCycle}`,
        customer_notify: 1,
        total_count: billingCycle === 'annual' ? 1 : 12,
        quantity: 1,
        notes: {
          userId,
          addons: JSON.stringify(addons),
        },
      });

      // Save subscription details
      await Subscription.create({
        userId,
        razorpaySubscriptionId: subscription.id,
        planType,
        status: 'active',
        currentPeriodEnd: new Date(
          Date.now() +
            (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000,
        ),
        addons,
        billingCycle,
        price: {
          amount,
          currency: 'INR',
        },
      });

      return res.json({subscription});
    } else {
      // PayPal subscription
      const amount = subscriptionPlans[planType][billingCycle].usd;
      const request = new paypal.subscriptions.SubscriptionsCreateRequest();
      request.requestBody({
        plan_id: `P-${planType.toUpperCase()}-${billingCycle.toUpperCase()}`,
        application_context: {
          brand_name: 'QuickAudit',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        },
      });

      const subscription = await paypalClient.execute(request);

      // Save subscription details
      await Subscription.create({
        userId,
        razorpaySubscriptionId: subscription.result.id,
        planType,
        status: 'active',
        currentPeriodEnd: new Date(
          Date.now() +
            (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000,
        ),
        addons,
        billingCycle,
        price: {
          amount,
          currency: 'USD',
        },
      });

      return res.json({subscription: subscription.result});
    }
  } catch (error) {
    console.error('Subscription creation failed:', error);
    return res.status(500).json({error: 'Subscription creation failed'});
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const {subscriptionId} = req.params;
    const subscription = await Subscription.findOne({
      razorpaySubscriptionId: subscriptionId,
    });

    if (!subscription) {
      return res.status(404).json({error: 'Subscription not found'});
    }

    const user = await User.findById(subscription.userId);
    const isIndianUser = user?.country === 'IN';

    if (isIndianUser) {
      // Cancel Razorpay subscription
      await razorpay.subscriptions.cancel(subscriptionId);
    } else {
      // Cancel PayPal subscription
      const request = new paypal.subscriptions.SubscriptionsCancelRequest(
        subscriptionId,
      );
      await paypalClient.execute(request);
    }

    // Update subscription status
    subscription.status = 'cancelled';
    await subscription.save();

    return res.json({message: 'Subscription cancelled successfully'});
  } catch (error) {
    console.error('Subscription cancellation failed:', error);
    return res.status(500).json({error: 'Subscription cancellation failed'});
  }
};

export const getSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({userId: req.user.id});
    return res.json({subscription});
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    return res.status(500).json({error: 'Failed to fetch subscription'});
  }
};
