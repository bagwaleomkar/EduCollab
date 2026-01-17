// Resource Model
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    default: '',
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  fileType: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  uploadedBy: {
    type: String, // Firebase UID
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for querying resources
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ groupId: 1 });
resourceSchema.index({ subject: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
