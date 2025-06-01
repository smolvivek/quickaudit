const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuditTemplate',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  auditor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'in_progress', 'pending_review', 'completed', 'archived'],
    default: 'draft'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    items: [{
      text: {
        type: String,
        required: true,
        trim: true
      },
      response: {
        type: String,
        enum: ['compliant', 'non-compliant', 'na']
      },
      notes: {
        type: String,
        trim: true
      },
      photos: [{
        type: String
      }],
      timestamp: {
        type: Date
      }
    }]
  }],
  findings: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    severity: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    photos: [{
      type: String
    }]
  }],
  actions: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed'],
      default: 'open'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completedDate: {
      type: Date
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  syncStatus: {
    type: String,
    enum: ['synced', 'pending_sync', 'conflict'],
    default: 'synced'
  },
  syncId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Method to calculate overall score
auditSchema.methods.calculateScore = function() {
  if (!this.sections || this.sections.length === 0) {
    return 0;
  }
  
  let totalItems = 0;
  let compliantItems = 0;
  
  this.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.response === 'compliant' || item.response === 'non-compliant') {
        totalItems++;
        if (item.response === 'compliant') {
          compliantItems++;
        }
      }
    });
  });
  
  if (totalItems === 0) {
    return 0;
  }
  
  return Math.round((compliantItems / totalItems) * 100);
};

// Method to calculate section scores
auditSchema.methods.calculateSectionScores = function() {
  if (!this.sections || this.sections.length === 0) {
    return;
  }
  
  this.sections.forEach(section => {
    let totalItems = 0;
    let compliantItems = 0;
    
    section.items.forEach(item => {
      if (item.response === 'compliant' || item.response === 'non-compliant') {
        totalItems++;
        if (item.response === 'compliant') {
          compliantItems++;
        }
      }
    });
    
    if (totalItems === 0) {
      section.score = 0;
    } else {
      section.score = Math.round((compliantItems / totalItems) * 100);
    }
  });
};

const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
