const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true
  },
  status: {
    type: String,
    enum: ['interested', 'withdrawn'],
    default: 'interested'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate interests
interestSchema.index({ candidateId: 1, driveId: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);