import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getSupplyChainData, getProductHistory } from '../services/blockchainService.js';

const router = express.Router();

// Get supply chain data for end users
router.get('/supply-chain/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const supplyChainData = await getProductHistory(productId);
    
    res.json({
      success: true,
      data: supplyChainData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product history',
      error: error.message
    });
  }
});

// Get all supply chain data
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

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const supplyChainData = await getSupplyChainData();
    
    // Mock dashboard data for end users
    const dashboardData = {
      stats: {
        totalProducts: supplyChainData.length || 0,
        verifiedProducts: supplyChainData.filter(item => item.verified).length || 0,
        pendingVerification: supplyChainData.filter(item => !item.verified).length || 0,
        trustedSuppliers: [...new Set(supplyChainData.map(item => item.supplier))].length || 0
      },
      recentOrders: supplyChainData.slice(0, 5) || [],
      featuredProducts: supplyChainData.filter(item => item.featured).slice(0, 6) || [],
      trustMetrics: {
        overallTrustScore: 95,
        transparencyScore: 92,
        qualityScore: 98,
        sustainabilityScore: 89
      },
      supplyChainVisualization: {
        totalSteps: 8,
        completedSteps: 6,
        currentStep: 'Quality Testing',
        estimatedCompletion: '2024-01-20T10:00:00Z'
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user dashboard data',
      error: error.message
    });
  }
});

export default router;
