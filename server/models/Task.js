// Task Model
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    default: 'General',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  assignedTo: [{
    type: String, // Array of Firebase UIDs
  }],
  createdBy: {
    type: String, // Firebase UID
    required: true,
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
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for querying tasks
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ groupId: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
