import mongoose from 'mongoose';

const qualityTestSchema = new mongoose.Schema({
  // Basic Information
  laboratoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
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
  processingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Processing'
  },

  // Test Information
  testType: {
    type: String,
    required: true,
    enum: [
      'quality_assessment',
      'dna_barcoding',
      'pesticide_analysis',
      'heavy_metal_test',
      'microbial_analysis',
      'nutritional_analysis',
      'authenticity_test',
      'purity_test',
      'moisture_content',
      'ash_content',
      'volatile_oil',
      'ph_test',
      'color_analysis',
      'aroma_analysis'
    ]
  },

  // Sample Information
  sample: {
    id: { type: String, required: true },
    weight: { type: Number, required: true }, // in grams
    unit: { type: String, default: 'g' },
    condition: { 
      type: String, 
      enum: ['fresh', 'dried', 'powdered', 'extract', 'oil'],
      required: true 
    },
    storage: {
      temperature: { type: Number }, // in Celsius
      humidity: { type: Number }, // percentage
      duration: { type: Number }, // in days
      container: { type: String }
    },
    chainOfCustody: [{
      from: { type: String },
      to: { type: String },
      timestamp: { type: Date, default: Date.now },
      signature: { type: String }
    }]
  },

  // Test Parameters
  parameters: {
    // Physical Parameters
    physical: {
      color: { type: String },
      appearance: { type: String },
      texture: { type: String },
      odor: { type: String },
      taste: { type: String },
      particleSize: { type: Number }, // in microns
      bulkDensity: { type: Number }, // g/ml
      tappedDensity: { type: Number } // g/ml
    },

    // Chemical Parameters
    chemical: {
      moisture: { type: Number }, // percentage
      ash: { type: Number }, // percentage
      acidInsolubleAsh: { type: Number }, // percentage
      waterSolubleAsh: { type: Number }, // percentage
      ph: { type: Number },
      totalAcidity: { type: Number }, // percentage
      volatileOil: { type: Number }, // percentage
      alcoholSolubleExtract: { type: Number }, // percentage
      waterSolubleExtract: { type: Number } // percentage
    },

    // Nutritional Parameters
    nutritional: {
      protein: { type: Number }, // percentage
      carbohydrates: { type: Number }, // percentage
      fat: { type: Number }, // percentage
      fiber: { type: Number }, // percentage
      minerals: { type: Number }, // percentage
      vitamins: { type: mongoose.Schema.Types.Mixed },
      calories: { type: Number } // per 100g
    },

    // Contaminant Parameters
    contaminants: {
      pesticides: [{
        name: { type: String },
        concentration: { type: Number }, // ppm
        mrl: { type: Number }, // Maximum Residue Limit
        result: { 
          type: String, 
          enum: ['pass', 'fail', 'warning'] 
        }
      }],
      heavyMetals: [{
        metal: { type: String },
        concentration: { type: Number }, // ppm
        limit: { type: Number },
        result: { 
          type: String, 
          enum: ['pass', 'fail', 'warning'] 
        }
      }],
      microbial: {
        totalPlateCount: { type: Number }, // CFU/g
        yeastMold: { type: Number }, // CFU/g
        eColi: { type: String, enum: ['present', 'absent'] },
        salmonella: { type: String, enum: ['present', 'absent'] },
        staphylococcus: { type: String, enum: ['present', 'absent'] }
      },
      aflatoxin: { type: Number }, // ppb
      ochratoxin: { type: Number }, // ppb
      patulin: { type: Number } // ppb
    },

    // DNA Barcoding
    dna: {
      species: { type: String },
      genus: { type: String },
      family: { type: String },
      sequence: { type: String },
      similarity: { type: Number }, // percentage
      database: { type: String },
      barcode: { type: String },
      authenticity: { 
        type: String, 
        enum: ['authentic', 'adulterated', 'inconclusive'] 
      }
    }
  },

  // Test Results
  results: {
    overallResult: { 
      type: String, 
      enum: ['pass', 'fail', 'conditional', 'pending'],
      required: true 
    },
    qualityGrade: { 
      type: String, 
      enum: ['Premium', 'Grade A', 'Grade B', 'Grade C', 'Rejected'] 
    },
    qualityScore: { type: Number, min: 0, max: 100 },
    compliance: {
      fssai: { type: Boolean, default: false },
      organic: { type: Boolean, default: false },
      export: { type: Boolean, default: false },
      pharmaceutical: { type: Boolean, default: false }
    },
    recommendations: [{ type: String }],
    limitations: [{ type: String }]
  },

  // Test Timeline
  timeline: {
    receivedDate: { type: Date, required: true },
    startDate: { type: Date },
    completionDate: { type: Date },
    reportDate: { type: Date },
    estimatedDuration: { type: Number }, // in hours
    actualDuration: { type: Number }, // in hours
    delays: [{
      reason: { type: String },
      duration: { type: Number }, // in hours
      timestamp: { type: Date, default: Date.now }
    }]
  },

  // Equipment and Methods
  equipment: {
    name: { type: String, required: true },
    model: { type: String },
    serialNumber: { type: String },
    calibrationDate: { type: Date },
    nextCalibration: { type: Date },
    operator: { type: String }
  },

  methodology: {
    standard: { type: String, required: true }, // ISO, AOAC, USP, etc.
    method: { type: String, required: true },
    version: { type: String },
    modifications: { type: String },
    reference: { type: String }
  },

  // Quality Control
  qualityControl: {
    blankTest: { type: Boolean, default: false },
    duplicateTest: { type: Boolean, default: false },
    spikeTest: { type: Boolean, default: false },
    controlSample: { type: String },
    recovery: { type: Number }, // percentage
    precision: { type: Number }, // percentage
    accuracy: { type: Number } // percentage
  },

  // Documentation
  documentation: {
    rawData: { type: mongoose.Schema.Types.Mixed },
    calculations: { type: mongoose.Schema.Types.Mixed },
    chromatograms: [{ type: String }], // URLs to chromatogram images
    spectra: [{ type: String }], // URLs to spectra images
    photos: [{
      url: { type: String, required: true },
      caption: { type: String },
      timestamp: { type: Date, default: Date.now }
    }],
    certificates: [{
      type: { type: String },
      url: { type: String },
      issuedBy: { type: String },
      issueDate: { type: Date }
    }]
  },

  // Personnel
  personnel: {
    analyst: { type: String, required: true },
    reviewer: { type: String },
    approver: { type: String },
    signatures: [{
      role: { type: String },
      name: { type: String },
      signature: { type: String },
      timestamp: { type: Date, default: Date.now }
    }]
  },

  // Status and Tracking
  status: {
    current: { 
      type: String, 
      enum: ['received', 'in_progress', 'completed', 'reviewed', 'approved', 'rejected'],
      default: 'received' 
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

  // Cost Information
  cost: {
    testCost: { type: Number },
    laborCost: { type: Number },
    materialCost: { type: Number },
    totalCost: { type: Number },
    currency: { type: String, default: 'INR' }
  },

  // Alerts and Issues
  alerts: [{
    type: { 
      type: String, 
      enum: ['quality_issue', 'equipment_failure', 'delay', 'compliance_issue', 'sample_issue'] 
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
    testTime: { type: Number }, // in hours
    accuracy: { type: Number }, // percentage
    precision: { type: Number }, // percentage
    customerSatisfaction: { type: Number },
    repeatability: { type: Number } // percentage
  },

  // Metadata
  metadata: {
    source: { type: String, default: 'laboratory_system' },
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
qualityTestSchema.index({ laboratoryId: 1, createdAt: -1 });
qualityTestSchema.index({ batchId: 1 });
qualityTestSchema.index({ harvestId: 1 });
qualityTestSchema.index({ testType: 1 });
qualityTestSchema.index({ 'status.current': 1 });
qualityTestSchema.index({ 'results.overallResult': 1 });
qualityTestSchema.index({ 'timeline.receivedDate': -1 });

// Virtual for test duration
qualityTestSchema.virtual('testDuration').get(function() {
  if (this.timeline.startDate && this.timeline.completionDate) {
    return (this.timeline.completionDate - this.timeline.startDate) / (1000 * 60 * 60); // hours
  }
  return 0;
});

// Virtual for compliance score
qualityTestSchema.virtual('complianceScore').get(function() {
  const compliance = this.results.compliance;
  let score = 0;
  if (compliance.fssai) score += 25;
  if (compliance.organic) score += 25;
  if (compliance.export) score += 25;
  if (compliance.pharmaceutical) score += 25;
  return score;
});

// Pre-save middleware to generate test ID if not provided
qualityTestSchema.pre('save', function(next) {
  if (!this.testId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.testId = `TEST-${timestamp}-${random}`.toUpperCase();
  }
  
  // Calculate actual duration
  if (this.timeline.startDate && this.timeline.completionDate) {
    this.timeline.actualDuration = (this.timeline.completionDate - this.timeline.startDate) / (1000 * 60 * 60); // hours
  }
  
  // Calculate total cost
  if (this.cost.testCost || this.cost.laborCost || this.cost.materialCost) {
    this.cost.totalCost = (this.cost.testCost || 0) + (this.cost.laborCost || 0) + (this.cost.materialCost || 0);
  }
  
  next();
});

// Method to update status
qualityTestSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.status.history.push({
    status: newStatus,
    updatedBy,
    notes
  });
  this.status.current = newStatus;
  return this.save();
};

// Method to add test result
qualityTestSchema.methods.addTestResult = function(resultData) {
  Object.assign(this.parameters, resultData);
  return this.save();
};

// Method to calculate quality score
qualityTestSchema.methods.calculateQualityScore = function() {
  let score = 0;
  let totalTests = 0;
  
  // Physical parameters scoring
  if (this.parameters.physical) {
    const physical = this.parameters.physical;
    if (physical.color) { score += 10; totalTests++; }
    if (physical.appearance) { score += 10; totalTests++; }
    if (physical.texture) { score += 10; totalTests++; }
    if (physical.odor) { score += 10; totalTests++; }
  }
  
  // Chemical parameters scoring
  if (this.parameters.chemical) {
    const chemical = this.parameters.chemical;
    if (chemical.moisture !== undefined) { 
      score += chemical.moisture <= 12 ? 15 : 10; 
      totalTests++; 
    }
    if (chemical.ash !== undefined) { 
      score += chemical.ash <= 8 ? 15 : 10; 
      totalTests++; 
    }
    if (chemical.ph !== undefined) { 
      score += chemical.ph >= 5 && chemical.ph <= 7 ? 15 : 10; 
      totalTests++; 
    }
  }
  
  // Contaminant scoring (lower is better)
  if (this.parameters.contaminants) {
    const contaminants = this.parameters.contaminants;
    if (contaminants.pesticides && contaminants.pesticides.length > 0) {
      const passedPesticides = contaminants.pesticides.filter(p => p.result === 'pass').length;
      score += (passedPesticides / contaminants.pesticides.length) * 20;
      totalTests++;
    }
    if (contaminants.heavyMetals && contaminants.heavyMetals.length > 0) {
      const passedMetals = contaminants.heavyMetals.filter(m => m.result === 'pass').length;
      score += (passedMetals / contaminants.heavyMetals.length) * 20;
      totalTests++;
    }
  }
  
  this.results.qualityScore = totalTests > 0 ? Math.round(score / totalTests) : 0;
  return this.results.qualityScore;
};

// Method to add alert
qualityTestSchema.methods.addAlert = function(alertData) {
  this.alerts.push({
    ...alertData,
    timestamp: new Date()
  });
  return this.save();
};

// Method to resolve alert
qualityTestSchema.methods.resolveAlert = function(alertIndex, resolvedBy) {
  if (this.alerts[alertIndex]) {
    this.alerts[alertIndex].resolved = true;
    this.alerts[alertIndex].resolvedBy = resolvedBy;
    this.alerts[alertIndex].resolvedAt = new Date();
  }
  return this.save();
};

// Static method to find by laboratory
qualityTestSchema.statics.findByLaboratory = function(laboratoryId, limit = 50) {
  return this.find({ laboratoryId })
    .populate('harvestId', 'crop batchId farmerId')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find by test type
qualityTestSchema.statics.findByTestType = function(testType) {
  return this.find({ testType })
    .populate('laboratoryId', 'profile laboratoryData')
    .populate('harvestId', 'crop batchId');
};

// Static method to get test statistics
qualityTestSchema.statics.getTestStats = function(laboratoryId = null) {
  const matchStage = laboratoryId ? { laboratoryId: new mongoose.Types.ObjectId(laboratoryId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        completedTests: {
          $sum: { $cond: [{ $eq: ['$status.current', 'completed'] }, 1, 0] }
        },
        passedTests: {
          $sum: { $cond: [{ $eq: ['$results.overallResult', 'pass'] }, 1, 0] }
        },
        averageQuality: { $avg: '$results.qualityScore' },
        averageDuration: { $avg: '$timeline.actualDuration' }
      }
    }
  ]);
};

export default mongoose.model('QualityTest', qualityTestSchema);
