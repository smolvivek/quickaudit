const mongoose = require('mongoose');

const auditTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    items: [{
      text: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        enum: ['checkbox', 'text', 'number', 'photo'],
        default: 'checkbox'
      },
      required: {
        type: Boolean,
        default: true
      },
      options: [{
        type: String,
        trim: true
      }]
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date
  }
}, {
  timestamps: true
});

const AuditTemplate = mongoose.model('AuditTemplate', auditTemplateSchema);

module.exports = AuditTemplate;
