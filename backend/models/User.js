const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['company', 'candidate'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Company fields
  companyName: String,
  companyDescription: String,
  website: String,
  contactNumber: String,
  
  // Candidate fields
  fullName: String,
  phone: String,
  location: String,
  skills: [String],
  experience: String,
  
  // Common fields
  profilePicture: String,
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);