import mongoose from 'mongoose';

const resellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    type: String,
    required: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true
  },
  commission: {
    type: Number,
    default: 30, // 30% commission
    min: 0,
    max: 50
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'pending'
  },
  minimumUsers: {
    type: Number,
    default: 10
  },
  customBranding: {
    logo: String,
    primaryColor: String,
    secondaryColor: String
  },
  paymentDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
resellerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Reseller = mongoose.model('Reseller', resellerSchema); 