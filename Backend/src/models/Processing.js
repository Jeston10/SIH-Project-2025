import mongoose from 'mongoose';

const processingSchema = new mongoose.Schema({
  // Basic Information
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  
  // Processing Details
  processingType: {
    type: String,
    required: true,
    enum: ['drying', 'cleaning', 'grinding', 'packaging', 'quality_check', 'storage']
  },
  
  // Input/Output Quantities
  quantities: {
    input: {
      weight: { type: Number, required: true }, // in kg
      unit: { type: String, default: 'kg' },
      moisture: { type: Number }, // percentage
      quality: { type: String }
    },
    output: {
      weight: { type: Number, required: true }, // in kg
      unit: { type: String, default: 'kg' },
      moisture: { type: Number }, // percentage
      quality: { type: String },
      yield: { type: Number } // percentage
    },
    waste: {
      weight: { type: Number, default: 0 },
      type: { type: String },
      disposal: { type: String }
    }
  },

  // Processing Parameters
  parameters: {
    temperature: { type: Number }, // in Celsius
    humidity: { type: Number }, // percentage
    duration: { type: Number }, // in hours
    pressure: { type: Number }, // in bar
    speed: { type: Number }, // rpm or similar
    settings: { type: mongoose.Schema.Types.Mixed }
  },

  // Equipment Information
  equipment: {
    name: { type: String, required: true },
    model: { type: String },
    serialNumber: { type: String },
    lastMaintenance: { type: Date },
    nextMaintenance: { type: Date },
    operator: { type: String }
  },

  // Quality Control
  qualityControl: {
    tests: [{
      testType: { type: String, required: true },
      parameter: { type: String, required: true },
      value: { type: Number, required: true },
      unit: { type: String },
      standard: { type: Number },
      result: { 
        type: String, 
        enum: ['pass', 'fail', 'warning'],
        required: true 
      },
      testedBy: { type: String },
      testDate: { type: Date, default: Date.now },
      notes: { type: String }
    }],
    overallResult: { 
      type: String, 
      enum: ['pass', 'fail', 'conditional'],
      required: true 
    },
    qualityScore: { type: Number, min: 0, max: 100 },
    inspector: { type: String },
    inspectionDate: { type: Date }
  },

  // Processing Steps
  steps: [{
    stepNumber: { type: Number, required: true },
    stepName: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number }, // in minutes
    status: { 
      type: String, 
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending' 
    },
    operator: { type: String },
    notes: { type: String },
    parameters: { type: mongoose.Schema.Types.Mixed }
  }],

  // Timeline
  timeline: {
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    estimatedDuration: { type: Number }, // in hours
    actualDuration: { type: Number }, // in hours
    delays: [{
      reason: { type: String },
      duration: { type: Number }, // in minutes
      timestamp: { type: Date, default: Date.now }
    }]
  },

  // Documentation
  documentation: {
    photos: [{
      url: { type: String, required: true },
      caption: { type: String },
      timestamp: { type: Date, default: Date.now },
      step: { type: String }
    }],
    videos: [{
      url: { type: String, required: true },
      caption: { type: String },
      duration: { type: Number }, // in seconds
      timestamp: { type: Date, default: Date.now }
    }],
    certificates: [{
      type: { type: String },
      url: { type: String },
      issuedBy: { type: String },
      issueDate: { type: Date }
    }],
    reports: [{
      type: { type: String },
      url: { type: String },
      generatedAt: { type: Date, default: Date.now }
    }]
  },

  // Environmental Conditions
  environment: {
    temperature: { type: Number }, // in Celsius
    humidity: { type: Number }, // percentage
    airQuality: { type: String },
    cleanliness: { type: String },
    lighting: { type: String }
  },

  // Compliance and Standards
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

  // Cost and Efficiency
  cost: {
    laborCost: { type: Number },
    energyCost: { type: Number },
    materialCost: { type: Number },
    totalCost: { type: Number },
    costPerKg: { type: Number },
    currency: { type: String, default: 'INR' }
  },

  efficiency: {
    throughput: { type: Number }, // kg per hour
    utilization: { type: Number }, // percentage
    downtime: { type: Number }, // in minutes
    oee: { type: Number } // Overall Equipment Effectiveness
  },

  // Status and Tracking
  status: {
    current: { 
      type: String, 
      enum: ['scheduled', 'in_progress', 'completed', 'paused', 'failed', 'cancelled'],
      default: 'scheduled' 
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    history: [{
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: { type: String }
    }]
  },

  // Blockchain Integration
  blockchain: {
    transactionHash: { type: String, trim: true },
    blockNumber: { type: Number },
    contractAddress: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date }
  },

  // Next Processing Step
  nextStep: {
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    processingType: { type: String },
    scheduledDate: { type: Date },
    estimatedDuration: { type: Number }
  },

  // Alerts and Notifications
  alerts: [{
    type: { 
      type: String, 
      enum: ['quality_issue', 'equipment_failure', 'delay', 'compliance_issue'] 
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

  // Analytics
  analytics: {
    processingTime: { type: Number }, // in hours
    qualityTrend: { type: Number },
    efficiencyTrend: { type: Number },
    costTrend: { type: Number },
    customerSatisfaction: { type: Number }
  },

  // Metadata
  metadata: {
    source: { type: String, default: 'facility_system' },
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
processingSchema.index({ facilityId: 1, createdAt: -1 });
processingSchema.index({ batchId: 1 });
processingSchema.index({ harvestId: 1 });
processingSchema.index({ processingType: 1 });
processingSchema.index({ 'status.current': 1 });
processingSchema.index({ 'timeline.startTime': -1 });
processingSchema.index({ 'qualityControl.overallResult': 1 });

// Virtual for processing efficiency
processingSchema.virtual('processingEfficiency').get(function() {
  if (this.timeline.estimatedDuration && this.timeline.actualDuration) {
    return Math.round((this.timeline.estimatedDuration / this.timeline.actualDuration) * 100);
  }
  return 0;
});

// Virtual for yield percentage
processingSchema.virtual('yieldPercentage').get(function() {
  if (this.quantities.input.weight && this.quantities.output.weight) {
    return Math.round((this.quantities.output.weight / this.quantities.input.weight) * 100);
  }
  return 0;
});

// Pre-save middleware to calculate derived values
processingSchema.pre('save', function(next) {
  // Calculate actual duration
  if (this.timeline.startTime && this.timeline.endTime) {
    this.timeline.actualDuration = (this.timeline.endTime - this.timeline.startTime) / (1000 * 60 * 60); // hours
  }
  
  // Calculate yield percentage
  if (this.quantities.input.weight && this.quantities.output.weight) {
    this.quantities.output.yield = (this.quantities.output.weight / this.quantities.input.weight) * 100;
  }
  
  // Calculate cost per kg
  if (this.cost.totalCost && this.quantities.output.weight) {
    this.cost.costPerKg = this.cost.totalCost / this.quantities.output.weight;
  }
  
  // Calculate throughput
  if (this.quantities.output.weight && this.timeline.actualDuration) {
    this.efficiency.throughput = this.quantities.output.weight / this.timeline.actualDuration;
  }
  
  next();
});

// Method to update status
processingSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.status.history.push({
    status: newStatus,
    updatedBy,
    notes
  });
  this.status.current = newStatus;
  return this.save();
};

// Method to add processing step
processingSchema.methods.addStep = function(stepData) {
  const stepNumber = this.steps.length + 1;
  this.steps.push({
    stepNumber,
    ...stepData,
    startTime: new Date()
  });
  return this.save();
};

// Method to complete step
processingSchema.methods.completeStep = function(stepNumber, endData = {}) {
  const step = this.steps.find(s => s.stepNumber === stepNumber);
  if (step) {
    step.endTime = new Date();
    step.duration = (step.endTime - step.startTime) / (1000 * 60); // minutes
    step.status = 'completed';
    Object.assign(step, endData);
  }
  return this.save();
};

// Method to add quality test
processingSchema.methods.addQualityTest = function(testData) {
  this.qualityControl.tests.push({
    ...testData,
    testDate: new Date()
  });
  return this.save();
};

// Method to add alert
processingSchema.methods.addAlert = function(alertData) {
  this.alerts.push({
    ...alertData,
    timestamp: new Date()
  });
  return this.save();
};

// Method to resolve alert
processingSchema.methods.resolveAlert = function(alertIndex, resolvedBy) {
  if (this.alerts[alertIndex]) {
    this.alerts[alertIndex].resolved = true;
    this.alerts[alertIndex].resolvedBy = resolvedBy;
    this.alerts[alertIndex].resolvedAt = new Date();
  }
  return this.save();
};

// Method to calculate overall quality score
processingSchema.methods.calculateQualityScore = function() {
  const tests = this.qualityControl.tests;
  if (tests.length === 0) return 0;
  
  let totalScore = 0;
  let passedTests = 0;
  
  tests.forEach(test => {
    if (test.result === 'pass') {
      totalScore += 100;
      passedTests++;
    } else if (test.result === 'warning') {
      totalScore += 70;
      passedTests++;
    }
  });
  
  this.qualityControl.qualityScore = passedTests > 0 ? Math.round(totalScore / passedTests) : 0;
  return this.qualityControl.qualityScore;
};

// Static method to find by facility
processingSchema.statics.findByFacility = function(facilityId, limit = 50) {
  return this.find({ facilityId })
    .populate('harvestId', 'crop batchId farmerId')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find by status
processingSchema.statics.findByStatus = function(status) {
  return this.find({ 'status.current': status })
    .populate('facilityId', 'profile facilityData')
    .populate('harvestId', 'crop batchId');
};

// Static method to get processing statistics
processingSchema.statics.getProcessingStats = function(facilityId = null) {
  const matchStage = facilityId ? { facilityId: new mongoose.Types.ObjectId(facilityId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalProcessings: { $sum: 1 },
        completedProcessings: {
          $sum: { $cond: [{ $eq: ['$status.current', 'completed'] }, 1, 0] }
        },
        averageQuality: { $avg: '$qualityControl.qualityScore' },
        averageEfficiency: { $avg: '$efficiency.throughput' },
        totalOutput: { $sum: '$quantities.output.weight' }
      }
    }
  ]);
};

export default mongoose.model('Processing', processingSchema);
