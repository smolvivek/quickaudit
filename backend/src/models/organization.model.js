const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'trial'],
      default: 'trial'
    }
  },
  settings: {
    branding: {
      primaryColor: {
        type: String,
        default: '#2563eb'
      },
      secondaryColor: {
        type: String,
        default: '#8b5cf6'
      }
    },
    features: {
      offlineMode: {
        type: Boolean,
        default: true
      },
      customForms: {
        type: Boolean,
        default: true
      },
      analytics: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
