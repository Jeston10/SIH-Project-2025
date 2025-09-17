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

// Dashboard for facility
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    let activeBatches = [];
    try {
      const raw = await getProcessingData(req.user.id);
      if (Array.isArray(raw)) {
        activeBatches = raw.slice(0, 4).map((p, i) => ({
          id: p.batchId || `B${i + 1}`,
          product: p.product || p.cropType || 'Product',
          stage: p.stepName || p.stage || 'Processing',
          progress: Number(p.progress ?? 50),
          status: p.status || 'In Progress',
        }));
      }
    } catch {}

    const stats = [
      { name: 'Active Batches', value: (activeBatches.length || 0).toString(), change: '+0', changeType: 'positive' },
      { name: 'Processing Steps', value: '0', change: '+0', changeType: 'positive' },
      { name: 'Shipments Today', value: '0', change: '+0', changeType: 'positive' },
      { name: 'Quality Score', value: '96%', change: '+0%', changeType: 'positive' }
    ];

    const recentShipments = [];

    res.json({
      success: true,
      data: { stats, activeBatches, recentShipments }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard', error: error.message });
  }
});
