import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addProcessingStep, getProcessingData } from '../services/blockchainService.js';

const router = express.Router();

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

// Get facility processing data
router.get('/processing', authenticateToken, async (req, res) => {
  try {
    const processingData = await getProcessingData(req.user.id);
    res.json({
      success: true,
      data: processingData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch processing data',
      error: error.message
    });
  }
});

export default router;
