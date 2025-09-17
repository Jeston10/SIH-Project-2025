import mongoose from 'mongoose';

const harvestSchema = new mongoose.Schema({
  // Basic Information
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Crop Information
  crop: {
    name: { type: String, required: true, trim: true },
    variety: { type: String, trim: true },
    scientificName: { type: String, trim: true },
    category: { 
      type: String, 
      enum: ['herb', 'spice', 'medicinal', 'aromatic', 'other'],
      required: true 
    }
  },

  // Location and Field Data
  field: {
    name: { type: String, required: true, trim: true },
    size: { type: Number, required: true }, // in acres
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      altitude: { type: Number }
    },
    soilType: { type: String, trim: true },
    irrigationType: { type: String, trim: true }
  },

  // Harvest Details
  harvestDate: { type: Date, required: true },
  quantity: {
    harvested: { type: Number, required: true }, // in kg
    unit: { type: String, default: 'kg' },
    estimatedYield: { type: Number },
    actualYield: { type: Number }
  },

  // Quality Metrics
  quality: {
    grade: { 
      type: String, 
      enum: ['Premium', 'Grade A', 'Grade B', 'Grade C'],
      required: true 
    },
    moisture: { type: Number }, // percentage
    purity: { type: Number }, // percentage
    color: { type: String, trim: true },
    aroma: { type: String, trim: true },
    texture: { type: String, trim: true }
  },

  // Environmental Conditions
  environmental: {
    temperature: { type: Number }, // in Celsius
    humidity: { type: Number }, // percentage
    rainfall: { type: Number }, // in mm
    windSpeed: { type: Number }, // in km/h
    weatherCondition: { 
      type: String, 
      enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'] 
    },
    soilMoisture: { type: Number }, // percentage
    phLevel: { type: Number }
  },

  // Cultivation Practices
  cultivation: {
    plantingDate: { type: Date },
    harvestMethod: { 
      type: String, 
      enum: ['manual', 'mechanical', 'mixed'],
      default: 'manual' 
    },
    fertilizers: [{
      name: { type: String },
      type: { type: String, enum: ['organic', 'inorganic', 'bio'] },
      quantity: { type: Number },
      applicationDate: { type: Date }
    }],
    pesticides: [{
      name: { type: String },
      type: { type: String, enum: ['organic', 'chemical', 'bio'] },
      quantity: { type: Number },
      applicationDate: { type: Date },
      lastSprayDate: { type: Date }
    }],
    irrigation: [{
      method: { type: String },
      frequency: { type: String },
      lastIrrigation: { type: Date }
    }]
  },

  // Documentation
  documentation: {
    photos: [{
      url: { type: String, required: true },
      caption: { type: String },
      timestamp: { type: Date, default: Date.now },
      gpsCoordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      }
    }],
    certificates: [{
      type: { type: String },
      url: { type: String },
      issuedBy: { type: String },
      issueDate: { type: Date },
      expiryDate: { type: Date }
    }],
    labReports: [{
      reportId: { type: String },
      labName: { type: String },
      testType: { type: String },
      result: { type: String },
      date: { type: Date },
      url: { type: String }
    }]
  },

  // Processing Information
  processing: {
    status: { 
      type: String, 
      enum: ['harvested', 'drying', 'cleaning', 'packaging', 'ready'],
      default: 'harvested' 
    },
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    processingDate: { type: Date },
    processingNotes: { type: String },
    weightLoss: { type: Number }, // percentage
    finalWeight: { type: Number } // in kg
  },

  // Blockchain Integration
  blockchain: {
    transactionHash: { type: String, trim: true },
    blockNumber: { type: Number },
    contractAddress: { type: String, trim: true },
    tokenId: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date }
  },

  // QR Code
  qrCode: {
    data: { type: String },
    imageUrl: { type: String },
    generatedAt: { type: Date, default: Date.now }
  },

  // Status and Tracking
  status: {
    current: { 
      type: String, 
      enum: ['pending', 'verified', 'processing', 'shipped', 'delivered', 'rejected'],
      default: 'pending' 
    },
    history: [{
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: { type: String }
    }]
  },

  // Compliance
  compliance: {
    organicCertified: { type: Boolean, default: false },
    fairTrade: { type: Boolean, default: false },
    sustainabilityScore: { type: Number, min: 0, max: 100 },
    carbonFootprint: { type: Number }, // in kg CO2
    waterUsage: { type: Number }, // in liters
    certifications: [{ type: String }]
  },

  // Pricing and Market
  pricing: {
    costPerKg: { type: Number },
    marketPrice: { type: Number },
    currency: { type: String, default: 'INR' },
    soldQuantity: { type: Number, default: 0 },
    remainingQuantity: { type: Number }
  },

  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    qualityScore: { type: Number, min: 0, max: 100 },
    sustainabilityScore: { type: Number, min: 0, max: 100 },
    traceabilityScore: { type: Number, min: 0, max: 100 }
  },

  // Metadata
  metadata: {
    source: { type: String, default: 'mobile_app' },
    deviceInfo: { type: String },
    appVersion: { type: String },
    ipAddress: { type: String }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
harvestSchema.index({ farmerId: 1, createdAt: -1 });
harvestSchema.index({ 'field.coordinates': '2dsphere' });
harvestSchema.index({ harvestDate: -1 });
harvestSchema.index({ 'crop.name': 1 });
harvestSchema.index({ 'status.current': 1 });
harvestSchema.index({ 'blockchain.transactionHash': 1 });

// Virtual for total quantity
harvestSchema.virtual('totalQuantity').get(function() {
  return this.quantity.harvested;
});

// Virtual for quality score
harvestSchema.virtual('overallQualityScore').get(function() {
  const scores = [
    this.quality.purity || 0,
    this.analytics.qualityScore || 0,
    this.compliance.sustainabilityScore || 0
  ];
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
});

// Pre-save middleware to generate batch ID if not provided
harvestSchema.pre('save', function(next) {
  if (!this.batchId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.batchId = `HARVEST-${timestamp}-${random}`.toUpperCase();
  }
  
  // Calculate remaining quantity
  if (this.pricing.soldQuantity && this.quantity.harvested) {
    this.pricing.remainingQuantity = this.quantity.harvested - this.pricing.soldQuantity;
  }
  
  next();
});

// Method to update status
harvestSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.status.history.push({
    status: newStatus,
    updatedBy,
    notes
  });
  this.status.current = newStatus;
  return this.save();
};

// Method to add photo
harvestSchema.methods.addPhoto = function(photoData) {
  this.documentation.photos.push({
    ...photoData,
    timestamp: new Date()
  });
  return this.save();
};

// Method to add lab report
harvestSchema.methods.addLabReport = function(reportData) {
  this.documentation.labReports.push({
    ...reportData,
    date: new Date()
  });
  return this.save();
};

// Method to calculate sustainability score
harvestSchema.methods.calculateSustainabilityScore = function() {
  let score = 0;
  
  // Organic certification bonus
  if (this.compliance.organicCertified) score += 20;
  
  // Fair trade bonus
  if (this.compliance.fairTrade) score += 15;
  
  // Water usage scoring (lower is better)
  if (this.compliance.waterUsage) {
    const waterScore = Math.max(0, 25 - (this.compliance.waterUsage / 100));
    score += waterScore;
  }
  
  // Carbon footprint scoring (lower is better)
  if (this.compliance.carbonFootprint) {
    const carbonScore = Math.max(0, 25 - (this.compliance.carbonFootprint / 10));
    score += carbonScore;
  }
  
  // Pesticide usage scoring
  const organicPesticides = this.cultivation.pesticides.filter(p => p.type === 'organic').length;
  const totalPesticides = this.cultivation.pesticides.length;
  if (totalPesticides > 0) {
    const pesticideScore = (organicPesticides / totalPesticides) * 15;
    score += pesticideScore;
  }
  
  this.compliance.sustainabilityScore = Math.min(100, Math.round(score));
  return this.compliance.sustainabilityScore;
};

// Static method to find by location
harvestSchema.statics.findByLocation = function(latitude, longitude, radius = 10) {
  return this.find({
    'field.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    }
  });
};

// Static method to find by crop
harvestSchema.statics.findByCrop = function(cropName) {
  return this.find({ 'crop.name': new RegExp(cropName, 'i') });
};

// Static method to get harvest statistics
harvestSchema.statics.getHarvestStats = function(farmerId = null) {
  const matchStage = farmerId ? { farmerId: new mongoose.Types.ObjectId(farmerId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalHarvests: { $sum: 1 },
        totalQuantity: { $sum: '$quantity.harvested' },
        averageQuality: { $avg: '$quality.purity' },
        organicCount: {
          $sum: { $cond: ['$compliance.organicCertified', 1, 0] }
        },
        premiumCount: {
          $sum: { $cond: [{ $eq: ['$quality.grade', 'Premium'] }, 1, 0] }
        }
      }
    }
  ]);
};

export default mongoose.model('Harvest', harvestSchema);
