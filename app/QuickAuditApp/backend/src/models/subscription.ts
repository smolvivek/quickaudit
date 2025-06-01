import mongoose, {Document, Schema} from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  razorpaySubscriptionId: string;
  planType: 'basic' | 'pro' | 'enterprise';
  status: string;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  addons: {
    customTemplates: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
  };
  resellerId: mongoose.Types.ObjectId | null;
  billingCycle: 'monthly' | 'annual';
  price: {
    amount: number;
    currency: string;
  };
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    planType: {
      type: String,
      enum: ['basic', 'pro', 'enterprise'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    addons: {
      customTemplates: {
        type: Boolean,
        default: false,
      },
      prioritySupport: {
        type: Boolean,
        default: false,
      },
      apiAccess: {
        type: Boolean,
        default: false,
      },
    },
    resellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Reseller',
      default: null,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
    },
    price: {
      amount: Number,
      currency: String,
    },
  },
  {
    timestamps: true,
  },
);

// Update timestamp on save
subscriptionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Subscription = mongoose.model<ISubscription>(
  'Subscription',
  subscriptionSchema,
);
