import mongoose from 'mongoose';

const supplyChainSchema = new mongoose.Schema({
  // Basic Information
  productId: {
    type: String,
    required: true,
    unique: true
  },
  batchId: {
    type: String,
    required: true
  },
  harvestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Harvest',
    required: true
  },

  // Product Information
  product: {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    variety: { type: String, trim: true },
    quantity: { type: Number, required: true }, // in kg
    unit: { type: String, default: 'kg' },
    packaging: {
      type: { type: String },
      material: { type: String },
      size: { type: String },
      weight: { type: Number }
    }
  },

  // Supply Chain Nodes
  nodes: [{
    nodeId: { type: String, required: true },
    nodeType: { 
      type: String, 
      enum: ['farm', 'processing', 'storage', 'transportation', 'laboratory', 'distribution', 'retail'],
      required: true 
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    entityName: { type: String, required: true },
    location: {
      address: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: 'India' }
    },
    status: { 
      type: String, 
      enum: ['pending', 'in_progress', 'completed', 'delayed', 'failed'],
      default: 'pending' 
    },
    timeline: {
      startTime: { type: Date },
      endTime: { type: Date },
      estimatedDuration: { type: Number }, // in hours
      actualDuration: { type: Number } // in hours
    },
    data: {
      temperature: { type: Number }, // in Celsius
      humidity: { type: Number }, // percentage
      conditions: { type: String },
      notes: { type: String }
    },
    qualityChecks: [{
      checkType: { type: String },
      result: { type: String, enum: ['pass', 'fail', 'warning'] },
      timestamp: { type: Date, default: Date.now },
      checkedBy: { type: String }
    }],
    documentation: [{
      type: { type: String },
      url: { type: String },
      description: { type: String },
      timestamp: { type: Date, default: Date.now }
    }]
  }],

  // Current Status
  currentStatus: {
    node: { type: String },
    location: { type: String },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    lastUpdate: { type: Date, default: Date.now },
    nextNode: { type: String },
    estimatedArrival: { type: Date }
  },

  // Transportation Details
  transportation: {
    mode: { 
      type: String, 
      enum: ['road', 'rail', 'air', 'sea', 'mixed'] 
    },
    vehicle: {
      type: { type: String },
      number: { type: String },
      driver: { type: String },
      contact: { type: String }
    },
    route: {
      origin: { type: String },
      destination: { type: String },
      waypoints: [{ type: String }],
      distance: { type: Number }, // in km
      estimatedTime: { type: Number } // in hours
    },
    tracking: {
      currentLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
        timestamp: { type: Date, default: Date.now }
      },
      history: [{
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
        timestamp: { type: Date, default: Date.now },
        speed: { type: Number }, // km/h
        heading: { type: Number } // degrees
      }]
    },
    conditions: {
      temperature: { type: Number }, // in Celsius
      humidity: { type: Number }, // percentage
      vibration: { type: Number },
      light: { type: Number },
      shock: { type: Number }
    }
  },

  // Quality Tracking
  qualityTracking: {
    initialQuality: {
      grade: { type: String },
      score: { type: Number },
      parameters: { type: mongoose.Schema.Types.Mixed }
    },
    currentQuality: {
      grade: { type: String },
      score: { type: Number },
      parameters: { type: mongoose.Schema.Types.Mixed }
    },
    qualityHistory: [{
      node: { type: String },
      timestamp: { type: Date, default: Date.now },
      quality: {
        grade: { type: String },
        score: { type: Number },
        parameters: { type: mongoose.Schema.Types.Mixed }
      },
      testedBy: { type: String }
    }],
    degradation: {
      rate: { type: Number }, // percentage per day
      factors: [{ type: String }],
      mitigation: [{ type: String }]
    }
  },

  // Environmental Conditions
  environmental: {
    temperature: {
      min: { type: Number },
      max: { type: Number },
      average: { type: Number },
      current: { type: Number }
    },
    humidity: {
      min: { type: Number },
      max: { type: Number },
      average: { type: Number },
      current: { type: Number }
    },
    exposure: {
      light: { type: Number }, // hours
      air: { type: Number }, // hours
      moisture: { type: Number } // hours
    }
  },

  // Compliance and Certifications
  compliance: {
    standards: [{ type: String }], // ISO, HACCP, etc.
    certifications: [{ type: String }],
    regulatoryRequirements: [{ type: String }],
    auditTrail: [{
      action: { type: String },
      timestamp: { type: Date, default: Date.now },
      performedBy: { type: String },
      details: { type: String }
    }]
  },

  // Blockchain Integration
  blockchain: {
    transactionHash: { type: String, trim: true },
    blockNumber: { type: Number },
    contractAddress: { type: String, trim: true },
    tokenId: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date },
    smartContractEvents: [{
      event: { type: String },
      blockNumber: { type: Number },
      transactionHash: { type: String },
      timestamp: { type: Date }
    }]
  },

  // QR Code and Traceability
  traceability: {
    qrCode: {
      data: { type: String },
      imageUrl: { type: String },
      generatedAt: { type: Date, default: Date.now }
    },
    publicUrl: { type: String },
    accessCode: { type: String },
    consumerAccess: { type: Boolean, default: true }
  },

  // Alerts and Notifications
  alerts: [{
    type: { 
      type: String, 
      enum: ['temperature_breach', 'humidity_breach', 'delay', 'quality_issue', 'security_breach', 'compliance_issue'] 
    },
    severity: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'] 
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date }
  }],

  // Cost and Efficiency
  cost: {
    totalCost: { type: Number },
    transportationCost: { type: Number },
    storageCost: { type: Number },
    processingCost: { type: Number },
    qualityTestCost: { type: Number },
    currency: { type: String, default: 'INR' }
  },

  efficiency: {
    totalTime: { type: Number }, // in hours
    plannedTime: { type: Number }, // in hours
    efficiency: { type: Number }, // percentage
    delays: { type: Number }, // in hours
    reasons: [{ type: String }]
  },

  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    scans: { type: Number, default: 0 },
    consumerFeedback: { type: Number, default: 0 },
    qualityRating: { type: Number, default: 0 },
    sustainabilityScore: { type: Number, default: 0 }
  },

  // Status and Tracking
  status: {
    current: { 
      type: String, 
      enum: ['created', 'in_transit', 'processing', 'stored', 'delivered', 'completed', 'recalled'],
      default: 'created' 
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    history: [{
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: { type: String }
    }]
  },

  // Metadata
  metadata: {
    source: { type: String, default: 'supply_chain_system' },
    version: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
supplyChainSchema.index({ batchId: 1 });
supplyChainSchema.index({ harvestId: 1 });
supplyChainSchema.index({ 'status.current': 1 });
supplyChainSchema.index({ 'currentStatus.lastUpdate': -1 });
supplyChainSchema.index({ 'transportation.tracking.currentLocation': '2dsphere' });
supplyChainSchema.index({ 'blockchain.transactionHash': 1 });

// Virtual for total journey time
supplyChainSchema.virtual('totalJourneyTime').get(function() {
  if (this.nodes.length === 0) return 0;
  
  const firstNode = this.nodes[0];
  const lastNode = this.nodes[this.nodes.length - 1];
  
  if (firstNode.timeline.startTime && lastNode.timeline.endTime) {
    return (lastNode.timeline.endTime - firstNode.timeline.startTime) / (1000 * 60 * 60); // hours
  }
  return 0;
});

// Virtual for current location
supplyChainSchema.virtual('currentLocation').get(function() {
  return this.transportation.tracking.currentLocation;
});

// Virtual for quality trend
supplyChainSchema.virtual('qualityTrend').get(function() {
  const history = this.qualityTracking.qualityHistory;
  if (history.length < 2) return 'stable';
  
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  
  if (latest.quality.score > previous.quality.score) return 'improving';
  if (latest.quality.score < previous.quality.score) return 'declining';
  return 'stable';
});

// Pre-save middleware to generate product ID if not provided
supplyChainSchema.pre('save', function(next) {
  if (!this.productId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.productId = `PROD-${timestamp}-${random}`.toUpperCase();
  }
  
  // Calculate progress based on completed nodes
  if (this.nodes.length > 0) {
    const completedNodes = this.nodes.filter(node => node.status === 'completed').length;
    this.status.progress = Math.round((completedNodes / this.nodes.length) * 100);
  }
  
  // Calculate efficiency
  if (this.efficiency.totalTime && this.efficiency.plannedTime) {
    this.efficiency.efficiency = Math.round((this.efficiency.plannedTime / this.efficiency.totalTime) * 100);
  }
  
  next();
});

// Method to add node
supplyChainSchema.methods.addNode = function(nodeData) {
  const nodeId = `NODE-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  this.nodes.push({
    nodeId,
    ...nodeData,
    timeline: {
      startTime: new Date(),
      ...nodeData.timeline
    }
  });
  return this.save();
};

// Method to update node status
supplyChainSchema.methods.updateNodeStatus = function(nodeId, status, data = {}) {
  const node = this.nodes.find(n => n.nodeId === nodeId);
  if (node) {
    node.status = status;
    if (status === 'completed') {
      node.timeline.endTime = new Date();
      if (node.timeline.startTime) {
        node.timeline.actualDuration = (node.timeline.endTime - node.timeline.startTime) / (1000 * 60 * 60);
      }
    }
    Object.assign(node, data);
  }
  return this.save();
};

// Method to add quality check
supplyChainSchema.methods.addQualityCheck = function(nodeId, checkData) {
  const node = this.nodes.find(n => n.nodeId === nodeId);
  if (node) {
    node.qualityChecks.push({
      ...checkData,
      timestamp: new Date()
    });
  }
  return this.save();
};

// Method to update tracking location
supplyChainSchema.methods.updateLocation = function(locationData) {
  // Add to history
  this.transportation.tracking.history.push({
    ...this.transportation.tracking.currentLocation,
    timestamp: new Date()
  });
  
  // Update current location
  this.transportation.tracking.currentLocation = {
    ...locationData,
    timestamp: new Date()
  };
  
  // Keep only last 100 locations
  if (this.transportation.tracking.history.length > 100) {
    this.transportation.tracking.history = this.transportation.tracking.history.slice(-100);
  }
  
  return this.save();
};

// Method to add alert
supplyChainSchema.methods.addAlert = function(alertData) {
  this.alerts.push({
    ...alertData,
    timestamp: new Date()
  });
  return this.save();
};

// Method to resolve alert
supplyChainSchema.methods.resolveAlert = function(alertIndex, resolvedBy) {
  if (this.alerts[alertIndex]) {
    this.alerts[alertIndex].resolved = true;
    this.alerts[alertIndex].resolvedBy = resolvedBy;
    this.alerts[alertIndex].resolvedAt = new Date();
  }
  return this.save();
};

// Method to update status
supplyChainSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.status.history.push({
    status: newStatus,
    updatedBy,
    notes
  });
  this.status.current = newStatus;
  this.currentStatus.lastUpdate = new Date();
  return this.save();
};

// Method to add blockchain event
supplyChainSchema.methods.addBlockchainEvent = function(eventData) {
  this.blockchain.smartContractEvents.push({
    ...eventData,
    timestamp: new Date()
  });
  return this.save();
};

// Static method to find by status
supplyChainSchema.statics.findByStatus = function(status) {
  return this.find({ 'status.current': status })
    .populate('harvestId', 'crop batchId farmerId')
    .sort({ 'currentStatus.lastUpdate': -1 });
};

// Static method to find by location
supplyChainSchema.statics.findByLocation = function(latitude, longitude, radius = 10) {
  return this.find({
    'transportation.tracking.currentLocation': {
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

// Static method to get supply chain statistics
supplyChainSchema.statics.getSupplyChainStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        inTransit: {
          $sum: { $cond: [{ $eq: ['$status.current', 'in_transit'] }, 1, 0] }
        },
        completed: {
          $sum: { $cond: [{ $eq: ['$status.current', 'completed'] }, 1, 0] }
        },
        averageQuality: { $avg: '$qualityTracking.currentQuality.score' },
        averageEfficiency: { $avg: '$efficiency.efficiency' }
      }
    }
  ]);
};

export default mongoose.model('SupplyChain', supplyChainSchema);
