// Group Model
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdBy: {
    type: String, // Firebase UID
    required: true,
    index: true,
  },
  members: [{
    type: String, // Array of Firebase UIDs
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
groupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for querying groups by member
groupSchema.index({ members: 1 });

module.exports = mongoose.model('Group', groupSchema);
