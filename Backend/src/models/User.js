import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    required: true,
    enum: ['farmer', 'facility', 'laboratory', 'regulatory', 'user']
  },
  
  // Profile Information
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    bio: { type: String, maxlength: 500 }
  },

  // Location Information
  location: {
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    pincode: { type: String, trim: true }
  },

  // User Type Specific Data
  farmerData: {
    farmName: { type: String, trim: true },
    farmSize: { type: Number }, // in acres
    crops: [{ type: String }],
    certifications: [{ type: String }],
    registrationNumber: { type: String, trim: true }
  },

  facilityData: {
    facilityName: { type: String, trim: true },
    facilityType: { 
      type: String, 
      enum: ['processing', 'storage', 'packaging', 'distribution'] 
    },
    capacity: { type: Number },
    certifications: [{ type: String }],
    licenseNumber: { type: String, trim: true }
  },

  laboratoryData: {
    labName: { type: String, trim: true },
    accreditation: [{ type: String }],
    equipment: [{ type: String }],
    licenseNumber: { type: String, trim: true },
    specialties: [{ type: String }]
  },

  regulatoryData: {
    authorityName: { type: String, trim: true },
    jurisdiction: { type: String, trim: true },
    badgeNumber: { type: String, trim: true },
    department: { type: String, trim: true }
  },

  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  
  // Security
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  emailVerificationToken: { type: String },
  
  // Blockchain Integration
  walletAddress: { type: String, trim: true },
  blockchainVerified: { type: Boolean, default: false },
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Kolkata' }
  },

  // Activity Tracking
  activityLog: [{
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
  }],

  // Statistics
  stats: {
    totalLogins: { type: Number, default: 0 },
    lastActivity: { type: Date },
    dataUploads: { type: Number, default: 0 },
    qualityScore: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ userType: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1, isVerified: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to log activity
userSchema.methods.logActivity = function(action, metadata = {}) {
  this.activityLog.push({
    action,
    timestamp: new Date(),
    metadata
  });
  
  // Keep only last 100 activities
  if (this.activityLog.length > 100) {
    this.activityLog = this.activityLog.slice(-100);
  }
  
  return this.save();
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users by type
userSchema.statics.findActiveByType = function(userType) {
  return this.find({ 
    userType, 
    isActive: true, 
    isVerified: true 
  });
};

// Method to get user dashboard data
userSchema.methods.getDashboardData = function() {
  const baseData = {
    id: this._id,
    email: this.email,
    userType: this.userType,
    profile: this.profile,
    location: this.location,
    isVerified: this.isVerified,
    stats: this.stats,
    createdAt: this.createdAt
  };

  // Add user type specific data
  switch (this.userType) {
    case 'farmer':
      baseData.farmerData = this.farmerData;
      break;
    case 'facility':
      baseData.facilityData = this.facilityData;
      break;
    case 'laboratory':
      baseData.laboratoryData = this.laboratoryData;
      break;
    case 'regulatory':
      baseData.regulatoryData = this.regulatoryData;
      break;
  }

  return baseData;
};

export default mongoose.model('User', userSchema);
