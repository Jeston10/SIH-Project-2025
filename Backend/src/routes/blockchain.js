import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  addHarvestData, 
  addProcessingStep, 
  addQualityTestResult, 
  addSupplyChainEvent,
  getHarvestData,
  getProcessingData,
  getQualityTestData,
  getSupplyChainData
} from '../services/blockchainService.js';

const router = express.Router();

// Add harvest data to blockchain
router.post('/harvest', authenticateToken, async (req, res) => {
  try {
    const { cropType, quantity, location, environmentalConditions, photoHash, qualityScore } = req.body;
    
    const result = await addHarvestData({
      harvestId: `harvest_${Date.now()}`,
      farmerId: req.user.id,
      cropType,
      quantity,
      location,
      environmentalConditions,
      photoHash,
      qualityScore
    });

    res.status(201).json({
      success: true,
      message: 'Harvest data added to blockchain',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add harvest data',
      error: error.message
    });
  }
});

// Add processing step to blockchain
router.post('/processing', authenticateToken, async (req, res) => {
  try {
    const { batchId, stepName, details, equipmentUsed, qualityCheckResult } = req.body;
    
    const result = await addProcessingStep({
      processingId: `processing_${Date.now()}`,
      batchId,
      facilityId: req.user.id,
      stepName,
      details,
      equipmentUsed,
      qualityCheckResult
    });

    res.status(201).json({
      success: true,
      message: 'Processing step added to blockchain',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add processing step',
      error: error.message
    });
  }
});

// Add quality test result to blockchain
router.post('/quality-test', authenticateToken, async (req, res) => {
  try {
    const { sampleId, testType, result, details, dnaBarcode, pesticideAnalysis } = req.body;
    
    const testResult = await addQualityTestResult({
      testId: `test_${Date.now()}`,
      sampleId,
      laboratoryId: req.user.id,
      testType,
      result,
      details,
      dnaBarcode,
      pesticideAnalysis
    });

    res.status(201).json({
      success: true,
      message: 'Quality test result added to blockchain',
      data: testResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add quality test result',
      error: error.message
    });
  }
});

// Add supply chain event to blockchain
router.post('/supply-chain', authenticateToken, async (req, res) => {
  try {
    const { productId, eventType, location, details, previousEventId } = req.body;
    
    const result = await addSupplyChainEvent({
      eventId: `event_${Date.now()}`,
      productId,
      entityId: req.user.id,
      eventType,
      location,
      details,
      previousEventId
    });

    res.status(201).json({
      success: true,
      message: 'Supply chain event added to blockchain',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add supply chain event',
      error: error.message
    });
  }
});

// Get all blockchain data
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const [harvestData, processingData, qualityData, supplyChainData] = await Promise.all([
      getHarvestData(),
      getProcessingData(),
      getQualityTestData(),
      getSupplyChainData()
    ]);

    res.json({
      success: true,
      data: {
        harvest: harvestData,
        processing: processingData,
        quality: qualityData,
        supplyChain: supplyChainData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blockchain data',
      error: error.message
    });
  }
});

export default router;
