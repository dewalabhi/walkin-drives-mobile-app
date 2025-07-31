const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  title: { type: String, required: true },
  description: String,
  requirements: String,
  
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  
  jobCategories: [String],
  specificSkills: [String],
  experienceLevel: [String],
  
  status: {
    type: String,
    enum: ['active', 'closed', 'postponed', 'cancelled'],
    default: 'active'
  },
  maxCandidates: Number,
  currentInterested: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Drive', driveSchema);