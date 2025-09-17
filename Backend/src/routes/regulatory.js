import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getSupplyChainData, getComplianceData } from '../services/blockchainService.js';

const router = express.Router();

// Get supply chain data for regulatory oversight
router.get('/supply-chain', authenticateToken, async (req, res) => {
  try {
    const supplyChainData = await getSupplyChainData();
    res.json({
      success: true,
      data: supplyChainData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supply chain data',
      error: error.message
    });
  }
});

// Get compliance data
router.get('/compliance', authenticateToken, async (req, res) => {
  try {
    const complianceData = await getComplianceData();
    res.json({
      success: true,
      data: complianceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance data',
      error: error.message
    });
  }
});

export default router;
